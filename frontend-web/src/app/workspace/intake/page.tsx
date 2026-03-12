'use client';

import { useEffect, useMemo, useState } from 'react';
import { DocsShell } from '@/components/docs-shell';
import {
  createEmptyPatient,
  getActivePatientId,
  loadWorkspacePatients,
  setActivePatientId,
  upsertWorkspacePatient,
  type WorkspacePatient,
} from '@/lib/workspace-store';

const intakeFields = [
  'Demografi ve treating institution',
  'Primary / recurrent ayrimi',
  'Tumor side, location, longitudinal segment',
  'Histology, grade, size, depth, metastasis',
  'Treatment intent, surgery, margin ve contamination',
];

export default function IntakeWorkspacePage() {
  const [patients, setPatients] = useState<WorkspacePatient[]>([]);
  const [draft, setDraft] = useState<WorkspacePatient>(createEmptyPatient());
  const [message, setMessage] = useState('');

  // Hydrate client-only workspace state from localStorage after mount.
  useEffect(() => {
    const stored = loadWorkspacePatients();
    const activeId = getActivePatientId();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPatients(stored);

    if (activeId) {
      const activePatient = stored.find((patient) => patient.id === activeId);
      if (activePatient) {
        setDraft(activePatient);
        return;
      }
    }

    if (stored[0]) {
      setDraft(stored[0]);
      setActivePatientId(stored[0].id);
    }
  }, []);

  const stats = useMemo(() => {
    const total = patients.length;
    const withImaging = patients.filter((patient) => patient.radiology.length > 0).length;
    const withFollowUps = patients.filter((patient) => patient.followUps.length > 0).length;
    return { total, withImaging, withFollowUps };
  }, [patients]);

  function selectPatient(patientId: string) {
    const patient = patients.find((item) => item.id === patientId);
    if (!patient) return;
    setDraft(patient);
    setActivePatientId(patient.id);
    setMessage(`${patient.fullName || patient.uniqueId || 'Hasta'} secildi. Simdi klinik alanlari guncelleyebilirsin.`);
  }

  function startNewPatient() {
    setDraft(createEmptyPatient());
    setMessage('Yeni hasta formu acildi. Kaydettikten sonra radyoloji ve follow-up alanlari bu hasta ile calisir.');
  }

  function updateField<K extends keyof WorkspacePatient>(field: K, value: WorkspacePatient[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function savePatient() {
    if (!draft.fullName.trim() && !draft.uniqueId.trim()) {
      setMessage('En azindan hasta adi veya benzersiz ID girmelisin.');
      return;
    }

    const nextPatients = upsertWorkspacePatient(draft);
    const persisted = nextPatients.find((patient) => patient.id === draft.id) ?? draft;
    setPatients(nextPatients);
    setDraft(persisted);
    setMessage(`${persisted.fullName || persisted.uniqueId} kaydedildi. Artik bu hasta icin goruntu ve follow-up verisi girebilirsin.`);
  }

  return (
    <DocsShell
      eyebrow="Patient intake"
      title="Staging + pathology + treatment fields"
      description="Veri girisi once hasta olusturmayla baslar. Kayitli hastalar bu ekranda listelenir; ayni hasta secilip klinik alanlari tekrar guncellenebilir."
      sideTitle="Intake Workspace"
      sideItems={intakeFields}
      sideNote="Bu workspace artik sadece tanitim degil. Hastayi once kaydet, sonra ayni kayit uzerinden klinik veri, goruntu ve follow-up akisini surdur."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <div className="workspace-card-head">
          <h3>Hasta kayit akisi</h3>
          <p>Kayitli bir hasta secilmeden goruntu veya follow-up girisi baslatilmaz. Bu ekran hasta cekirdegini olusturur ve daha sonra ayni kaydin uzerine yazmaya izin verir.</p>
        </div>

        <div className="stats-grid stats-grid-triple">
          <div className="stat-box"><span>Toplam hasta</span><strong>{stats.total}</strong></div>
          <div className="stat-box"><span>Goruntu kaydi olan</span><strong>{stats.withImaging}</strong></div>
          <div className="stat-box"><span>Follow-up olan</span><strong>{stats.withFollowUps}</strong></div>
        </div>

        <div className="workspace-patient-toolbar">
          <button type="button" className="button secondary small" onClick={startNewPatient}>Yeni Hasta</button>
          <span className="docs-side-note">Kaydetme sonrasi aktif hasta secimi otomatik yapilir.</span>
        </div>

        <div className="workspace-record-grid">
          <section className="workspace-record-list">
            <div className="workspace-section-kicker">Kayitli hastalar</div>
            {patients.length > 0 ? patients.map((patient) => (
              <button
                key={patient.id}
                type="button"
                className={`workspace-record-item${patient.id === draft.id ? ' active' : ''}`}
                onClick={() => selectPatient(patient.id)}
              >
                <strong>{patient.fullName || 'Adsiz hasta'}</strong>
                <span>{patient.uniqueId || 'ID yok'}</span>
                <span>{patient.diagnosis || 'Tani girilmedi'}</span>
              </button>
            )) : <p className="docs-side-note">Henuz kayitli hasta yok. Once yeni hasta olustur.</p>}
          </section>

          <section className="workspace-record-editor">
            <div className="form-grid">
              <label>
                <span>Hasta adi</span>
                <input value={draft.fullName} onChange={(event) => updateField('fullName', event.target.value)} placeholder="Ad Soyad" />
              </label>
              <label>
                <span>Benzersiz ID</span>
                <input value={draft.uniqueId} onChange={(event) => updateField('uniqueId', event.target.value)} placeholder="Hospital no / local ID" />
              </label>
              <label>
                <span>Tani</span>
                <input value={draft.diagnosis} onChange={(event) => updateField('diagnosis', event.target.value)} placeholder="Kemik / yumusak doku histolojisi" />
              </label>
              <label>
                <span>Stage</span>
                <input value={draft.stage} onChange={(event) => updateField('stage', event.target.value)} placeholder="AJCC / Enneking / lokal stage" />
              </label>
              <label>
                <span>Patoloji</span>
                <input value={draft.pathology} onChange={(event) => updateField('pathology', event.target.value)} placeholder="Grade, depth, metastasis ozeti" />
              </label>
              <label>
                <span>Tedavi plani</span>
                <input value={draft.treatmentPlan} onChange={(event) => updateField('treatmentPlan', event.target.value)} placeholder="Curative / palliative / surgery plan" />
              </label>
              <label>
                <span>Klinik not</span>
                <textarea value={draft.notes} onChange={(event) => updateField('notes', event.target.value)} placeholder="Demografi, side, location, margin ve ek notlar" />
              </label>
            </div>

            <div className="workspace-patient-toolbar">
              <button type="button" className="button primary" onClick={savePatient}>Hastayi Kaydet / Guncelle</button>
              {message ? <span className="docs-side-note">{message}</span> : null}
            </div>
          </section>
        </div>
      </article>
    </DocsShell>
  );
}
