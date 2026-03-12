'use client';

import { useMemo, useState } from 'react';
import { DocsShell } from '@/components/docs-shell';

const acceptedTypes = ['.dcm', '.dicom', '.jpg', '.jpeg', '.tif', '.tiff'];

export default function RadiologyWorkspacePage() {
  const [files, setFiles] = useState<File[]>([]);

  const summary = useMemo(() => {
    const dicom = files.filter((file) => file.name.toLowerCase().endsWith('.dcm') || file.name.toLowerCase().endsWith('.dicom')).length;
    const raster = files.length - dicom;
    return { total: files.length, dicom, raster };
  }, [files]);

  return (
    <DocsShell
      eyebrow="Radiology stack"
      title="MRI, BT, radyografi, DICOM seri gruplari"
      description="Bu alan goruntu yukleme mantigini aciklar ve temel bir yukleme yuzeyi sunar. Ama amac hasta bazli radiology domain modelini gostermektir."
      sideTitle="Radiology Workspace"
      sideItems={[
        'Preop ve postop MRI',
        'Preop ve postop BT',
        'Preop ve postop radyografi',
        'Follow-up radiology domaini',
        'DICOM / JPEG / TIFF kabul edilir',
      ]}
      sideNote="Bu web yuzeyindeki dosya secici tanitim ve onboarding amacli bir giris alanidir. Klinik asıl arsivleme akisi mobil uygulamada devam eder."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <h3>Goruntu yukleme alani</h3>
        <p>Bir hastaya goruntu serisi eklerken DICOM, JPEG veya TIFF formatlari kabul edilir. Domain bazli siniflama ile preop/postop ve follow-up serileri ayrilir.</p>
        <label className="upload-dropzone">
          <span className="workspace-section-kicker">Upload</span>
          <strong>DICOM / JPEG / TIFF sec</strong>
          <span>Birden fazla dosya secilebilir. Kabul edilen uzantilar: {acceptedTypes.join(', ')}</span>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
        </label>

        <div className="stats-grid stats-grid-triple">
          <div className="stat-box"><span>Toplam</span><strong>{summary.total}</strong></div>
          <div className="stat-box"><span>DICOM</span><strong>{summary.dicom}</strong></div>
          <div className="stat-box"><span>JPEG/TIFF</span><strong>{summary.raster}</strong></div>
        </div>

        <div className="selected-file-list">
          {files.length > 0 ? files.map((file) => (
            <article key={`${file.name}-${file.size}`} className="selected-file-item">
              <strong>{file.name}</strong>
              <span>{Math.round(file.size / 1024)} KB</span>
            </article>
          )) : <p className="docs-side-note">Henuz dosya secilmedi.</p>}
        </div>
      </article>
    </DocsShell>
  );
}
