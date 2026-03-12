'use client';

import { useEffect, useMemo, useState } from 'react';
import { DocsShell } from '@/components/docs-shell';
import {
  appendRadiologyRecord,
  getActivePatientId,
  loadWorkspacePatients,
  setActivePatientId,
  type WorkspacePatient,
} from '@/lib/workspace-store';

const acceptedTypes = ['.dcm', '.dicom', '.jpg', '.jpeg', '.tif', '.tiff'];
const radiologyDomains = [
  'Preop radyografi',
  'Postop radyografi',
  'Preop MRI',
  'Postop MRI',
  'Preop BT',
  'Postop BT',
  'Radyolojik takip',
];

export default function RadiologyWorkspacePage() {
  const [patients, setPatients] = useState<WorkspacePatient[]>([]);
  const [activePatientId, setActivePatientIdState] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [domain, setDomain] = useState(radiologyDomains[0]);
  const [message, setMessage] = useState('');

  // Hydrate client-only workspace state from localStorage after mount.
  useEffect(() => {
    const stored = loadWorkspacePatients();
    const activeId = getActivePatientId();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPatients(stored);
    if (activeId && stored.some((patient) => patient.id === activeId)) {
      setActivePatientIdState(activeId);
    } else if (stored[0]) {
      setActivePatientIdState(stored[0].id);
      setActivePatientId(stored[0].id);
    }
  }, []);

  const activePatient = useMemo(
    () => patients.find((patient) => patient.id === activePatientId) ?? null,
    [patients, activePatientId],
  );

  const summary = useMemo(() => {
    const dicom = files.filter((file) => file.name.toLowerCase().endsWith('.dcm') || file.name.toLowerCase().endsWith('.dicom')).length;
    const raster = files.length - dicom;
    return { total: files.length, dicom, raster };
  }, [files]);

  function handlePatientChange(patientId: string) {
    setActivePatientIdState(patientId);
    setActivePatientId(patientId);
    setMessage('Secili hasta guncellendi. Yeni seri bu hasta altina yazilacak.');
  }

  function saveRadiologyRecord() {
    if (!activePatientId) {
      setMessage('Once hasta kaydi secilmeli veya intake ekraninda yeni hasta olusturulmalidir.');
      return;
    }

    if (files.length === 0) {
      setMessage('Kaydetmek icin en az bir goruntu dosyasi secmelisin.');
      return;
    }

    const next = appendRadiologyRecord(activePatientId, {
      domain,
      fileNames: files.map((file) => file.name),
      totalFiles: summary.total,
      dicomFiles: summary.dicom,
      rasterFiles: summary.raster,
    });

    setPatients(next);
    setFiles([]);
    setMessage('Goruntu serisi secili hasta altina kaydedildi. Bu demo surumunde dosya icerigi degil, seri metaverisi tutulur.');
  }

  return (
    <DocsShell
      eyebrow="Radiology stack"
      title="MRI, BT, radyografi, DICOM seri gruplari"
      description="Goruntu girisi hasta secimiyle baslar. Kayitli bir hasta secilir, domain belirlenir ve seri o hastanin radyoloji arsivine eklenir."
      sideTitle="Radiology Workspace"
      sideItems={[
        'Preop ve postop MRI',
        'Preop ve postop BT',
        'Preop ve postop radyografi',
        'Follow-up radiology domaini',
        'DICOM / JPEG / TIFF kabul edilir',
      ]}
      sideNote="Bu sayfa artik sadece tanitim degil. Secili hastanin mevcut radyoloji serilerini listeler ve yeni seri eklemeye izin verir."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <div className="workspace-card-head">
          <h3>Hasta bazli goruntu arsivi</h3>
          <p>Goruntu girisi, hasta kaydi olmadan baslamaz. Once intake ekraninda hasta olustur, sonra ayni hasta altina preop/postop veya follow-up serilerini ekle.</p>
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
            <span>Radyoloji domaini</span>
            <select value={domain} onChange={(event) => setDomain(event.target.value)}>
              {radiologyDomains.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="upload-dropzone">
          <span className="workspace-section-kicker">Upload</span>
          <strong>{activePatient ? `${activePatient.fullName || activePatient.uniqueId} icin seri sec` : 'Once hasta sec, sonra seri ekle'}</strong>
          <span>Birden fazla dosya secilebilir. Kabul edilen uzantilar: {acceptedTypes.join(', ')}</span>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            disabled={!activePatient}
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
        </label>

        <div className="stats-grid stats-grid-triple">
          <div className="stat-box"><span>Toplam</span><strong>{summary.total}</strong></div>
          <div className="stat-box"><span>DICOM</span><strong>{summary.dicom}</strong></div>
          <div className="stat-box"><span>JPEG/TIFF</span><strong>{summary.raster}</strong></div>
        </div>

        <div className="workspace-patient-toolbar">
          <button type="button" className="button primary" onClick={saveRadiologyRecord}>Seriyi Hastaya Kaydet</button>
          {message ? <span className="docs-side-note">{message}</span> : null}
        </div>

        <div className="selected-file-list">
          {files.length > 0 ? files.map((file) => (
            <article key={`${file.name}-${file.size}`} className="selected-file-item">
              <strong>{file.name}</strong>
              <span>{Math.round(file.size / 1024)} KB</span>
            </article>
          )) : <p className="docs-side-note">Henuz dosya secilmedi.</p>}
        </div>

        <div className="workspace-record-list">
          <div className="workspace-section-kicker">Secili hastanin kayitli serileri</div>
          {activePatient?.radiology.length ? activePatient.radiology.map((record) => (
            <article key={record.id} className="workspace-record-item static">
              <strong>{record.domain}</strong>
              <span>{record.totalFiles} dosya · {record.dicomFiles} DICOM · {record.rasterFiles} raster</span>
              <span>{record.fileNames.slice(0, 3).join(', ')}{record.fileNames.length > 3 ? ' ...' : ''}</span>
            </article>
          )) : <p className="docs-side-note">Secili hasta icin henuz seri kaydi yok.</p>}
        </div>
      </article>
    </DocsShell>
  );
}
