import { Directory, File, Paths } from 'expo-file-system';
import { getDb } from '@/src/db';
import type { ImageSourceType, ImageType, PatientImage } from '@/src/types';

function mapRow(row: any): PatientImage {
  return {
    id: row.id,
    patientId: row.patient_id,
    fileUri: row.file_uri,
    thumbnailUri: row.thumbnail_uri,
    label: row.label,
    imageType: row.image_type,
    modality: row.modality,
    bodyPart: row.body_part,
    bodySide: row.body_side,
    sourceType: row.source_type,
    capturedAt: row.captured_at,
    mimeType: row.mime_type,
    fileSizeBytes: row.file_size_bytes,
    width: row.width,
    height: row.height,
    checksum: row.checksum,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function ensureImageDir() {
  const dir = new Directory(Paths.document, 'tumor-images');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

function fileExtensionFromMime(mimeType?: string | null) {
  if (!mimeType) return 'jpg';
  const parts = mimeType.split('/');
  return parts[1] || 'jpg';
}

export async function listPatientImages(patientId: string) {
  const db = await getDb();
  const rows = await db.getAllAsync(
    `SELECT * FROM images WHERE patient_id = ? ORDER BY created_at DESC;`,
    [patientId]
  );
  return rows.map(mapRow);
}

export async function savePatientImage(params: {
  patientId: string;
  sourceUri: string;
  label?: string;
  imageType?: ImageType;
  modality?: string;
  bodyPart?: string;
  bodySide?: string;
  sourceType?: ImageSourceType;
  capturedAt?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  width?: number;
  height?: number;
  notes?: string;
}) {
  const db = await getDb();
  const dir = ensureImageDir();
  const id = crypto.randomUUID();
  const fileName = `${params.patientId}-${id}.${fileExtensionFromMime(params.mimeType)}`;
  const target = new File(dir, fileName);
  const incoming = new File(params.sourceUri);
  incoming.copy(target);

  await db.runAsync(
    `INSERT INTO images (
      id, patient_id, file_uri, thumbnail_uri, label, image_type, modality, body_part,
      body_side, source_type, captured_at, mime_type, file_size_bytes, width, height,
      checksum, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      params.patientId,
      target.uri,
      null,
      params.label ?? null,
      params.imageType ?? 'other',
      params.modality ?? null,
      params.bodyPart ?? null,
      params.bodySide ?? null,
      params.sourceType ?? 'other',
      params.capturedAt ?? new Date().toISOString(),
      params.mimeType ?? null,
      params.fileSizeBytes ?? null,
      params.width ?? null,
      params.height ?? null,
      null,
      params.notes ?? null,
      Date.now(),
    ]
  );

  return id;
}

export async function deletePatientImage(id: string) {
  const db = await getDb();
  const row = await db.getFirstAsync(`SELECT file_uri FROM images WHERE id = ?;`, [id]);
  if (row?.file_uri) {
    const file = new File(row.file_uri);
    if (file.exists) file.delete();
  }
  await db.runAsync(`DELETE FROM images WHERE id = ?;`, [id]);
}
