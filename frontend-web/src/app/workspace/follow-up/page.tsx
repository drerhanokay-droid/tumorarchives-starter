'use client';

import { useEffect, useMemo, useState } from 'react';
import { DocsShell } from '@/components/docs-shell';
import {
  appendFollowUpRecord,
  getActivePatientId,
  loadWorkspacePatients,
  setActivePatientId,
  type WorkspacePatient,
} from '@/lib/workspace-store';

const followUpItems = [
  'NED / AWD / DOD durum takibi',
  'Treatment plan secimi',
  'Tumor board yorumlari',
  'Kontrol tarihi onerisi',
  'Radyoloji serisi ile follow-up eslestirme',
];

const treatmentPlans = ['Investigation', 'Surgery', 'Follow-up', 'Discharge'];
const diseaseStatuses = ['NED', 'AWD', 'DOD'];

function suggestControlDate(visitDate: string, treatmentPlan: string) {
  const date = new Date(visitDate || new Date().toISOString().slice(0, 10));
  const daysToAdd = treatmentPlan === 'Surgery' ? 14 : treatmentPlan === 'Investigation' ? 7 : treatmentPlan === 'Follow-up' ? 90 : 180;
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().slice(0, 10);
}

export default function FollowUpWorkspacePage() {
  const [patients, setPatients] = useState<WorkspacePatient[]>([]);
  const [activePatientId, setActivePatientIdState] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [diseaseStatus, setDiseaseStatus] = useState(diseaseStatuses[0]);
  const [treatmentPlan, setTreatmentPlan] = useState(treatmentPlans[2]);
  const [controlDate, setControlDate] = useState(suggestControlDate(new Date().toISOString().slice(0, 10), treatmentPlans[2]));
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  // Hydrate client-only workspace state from localStorage after mount.
  useEffect(() => {
    const stored = loadWorkspacePatients();
    const activeId = getActivePatientId();
    setPatients(stored);
    if (activeId && stored.some((patient) => patient.id === activeId)) {
      setActivePatientIdState(activeId);
    } else if (stored[0]) {
      setActivePatientIdState(stored[0].id);
      setActivePatientId(stored[0].id);
    }
  }, []);

  useEffect(() => {
    setControlDate(suggestControlDate(visitDate, treatmentPlan));
  }, [visitDate, treatmentPlan]);

  const activePatient = useMemo(
    () => patients.find((patient) => patient.id === activePatientId) ?? null,
    [patients, activePatientId],
  );

  function handlePatientChange(patientId: string) {
    setActivePatientIdState(patientId);
    setActivePatientId(patientId);
    setMessage('Secili hasta guncellendi. Yeni follow-up kaydi bu hasta altina yazilacak.');
  }

  function saveFollowUp() {
    if (!activePatientId) {
      setMessage('Follow-up girmek icin once kayitli bir hasta secmelisin.');
      return;
    }

    const next = appendFollowUpRecord(activePatientId, {
      visitDate,
      diseaseStatus,
      treatmentPlan,
      controlDate,
      note,
    });

    setPatients(next);
    setNote('');
    setMessage('Follow-up kaydi secili hasta altina eklendi. Bu hasta tekrar secilerek sonraki kontroller de guncellenebilir.');
  }

  return (
    <DocsShell
      eyebrow="Outcome loop"
      title="NED / AWD / DOD + timeline + control dates"
      description="Follow-up girisi secili hasta uzerinden ilerler. Kayitli hasta tekrar secilir, durum ve plan guncellenir, onerilen kontrol tarihi otomatik hesaplanir."
      sideTitle="Follow-up Workspace"
      sideItems={followUpItems}
      sideNote="Bu sayfa artik pasif bilgi katmani degil. Hasta secildikten sonra ayni kayit uzerinde outcome ve kontrol akisi guncellenir."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <div className="workspace-card-head">
          <h3>Hasta secimi ile takip guncelleme</h3>
          <p>Follow-up veri girisi yeni bir hastayla degil, kayitli hasta uzerinden surdurulur. Boylece timeline ve kontrol tarihi ayni hasta kimligi altinda birikir.</p>
        </div>

        <div className="form-grid workspace-two-column-grid">
          <label>
            <span>Secili hasta</span>
            <select value={activePatientId} onChange={(event) => handlePatientChange(event.target.value)}>
              <option value="">Hasta sec</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>{patient.fullName || patient.uniqueId || 'Adsiz hasta'}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Kontrol tarihi</span>
            <input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} />
          </label>
          <label>
            <span>Hastalik durumu</span>
            <select value={diseaseStatus} onChange={(event) => setDiseaseStatus(event.target.value)}>
              {diseaseStatuses.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Tedavi plani</span>
            <select value={treatmentPlan} onChange={(event) => setTreatmentPlan(event.target.value)}>
              {treatmentPlans.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Onerilen sonraki kontrol</span>
            <input type="date" value={controlDate} onChange={(event) => setControlDate(event.target.value)} />
          </label>
          <label>
            <span>Klinik not</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Tumor board yorumu, cerrahi not veya outcome ozeti" />
          </label>
        </div>

        <div className="workspace-patient-toolbar">
          <button type="button" className="button primary" onClick={saveFollowUp}>Follow-up Kaydini Ekle</button>
          {message ? <span className="docs-side-note">{message}</span> : null}
        </div>

        <div className="workspace-record-list">
          <div className="workspace-section-kicker">Secili hastanin timeline kayitlari</div>
          {activePatient?.followUps.length ? activePatient.followUps.map((record) => (
            <article key={record.id} className="workspace-record-item static">
              <strong>{record.diseaseStatus} · {record.treatmentPlan}</strong>
              <span>Ziyaret: {record.visitDate} · Sonraki kontrol: {record.controlDate}</span>
              <span>{record.note || 'Ek not yok'}</span>
            </article>
          )) : <p className="docs-side-note">Secili hasta icin henuz follow-up kaydi yok.</p>}
        </div>
      </article>
    </DocsShell>
  );
}
