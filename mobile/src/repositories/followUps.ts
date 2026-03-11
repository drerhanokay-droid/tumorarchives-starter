import { getDb } from '@/src/db';
import type { FollowUp } from '@/src/types';

function mapRow(row: any): FollowUp {
  return {
    id: row.id,
    patientId: row.patient_id,
    visitDate: row.visit_date,
    visitType: row.visit_type,
    postoperativeMonth: row.postoperative_month,
    complaint: row.complaint,
    findings: row.findings,
    painVas: row.pain_vas,
    ecog: row.ecog,
    karnofsky: row.karnofsky,
    mstsScore: row.msts_score,
    localRecurrenceStatus: row.local_recurrence_status,
    metastasisStatus: row.metastasis_status,
    lungMetastasisStatus: row.lung_metastasis_status,
    woundStatus: row.wound_status,
    implantStatus: row.implant_status,
    unionStatus: row.union_status,
    weightBearingStatus: row.weight_bearing_status,
    romSummary: row.rom_summary,
    imagingSummary: row.imaging_summary,
    pathologySummary: row.pathology_summary,
    complicationsJson: row.complications_json,
    treatmentSinceLastVisit: row.treatment_since_last_visit,
    plan: row.plan,
    nextVisitDate: row.next_visit_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listFollowUps(patientId: string) {
  const db = await getDb();
  const rows = await db.getAllAsync(
    `SELECT * FROM follow_ups WHERE patient_id = ? ORDER BY visit_date DESC, created_at DESC;`,
    [patientId]
  );
  return rows.map(mapRow);
}

export async function getFollowUpById(id: string) {
  const db = await getDb();
  const row = await db.getFirstAsync(`SELECT * FROM follow_ups WHERE id = ?;`, [id]);
  return row ? mapRow(row) : null;
}

export async function upsertFollowUp(
  input: Partial<FollowUp> & Pick<FollowUp, 'patientId' | 'visitDate'>
) {
  const db = await getDb();
  const now = Date.now();
  const followUp: FollowUp = {
    id: input.id ?? crypto.randomUUID(),
    patientId: input.patientId,
    visitDate: input.visitDate,
    visitType: input.visitType ?? null,
    postoperativeMonth: input.postoperativeMonth ?? null,
    complaint: input.complaint ?? null,
    findings: input.findings ?? null,
    painVas: input.painVas ?? null,
    ecog: input.ecog ?? null,
    karnofsky: input.karnofsky ?? null,
    mstsScore: input.mstsScore ?? null,
    localRecurrenceStatus: input.localRecurrenceStatus ?? null,
    metastasisStatus: input.metastasisStatus ?? null,
    lungMetastasisStatus: input.lungMetastasisStatus ?? null,
    woundStatus: input.woundStatus ?? null,
    implantStatus: input.implantStatus ?? null,
    unionStatus: input.unionStatus ?? null,
    weightBearingStatus: input.weightBearingStatus ?? null,
    romSummary: input.romSummary ?? null,
    imagingSummary: input.imagingSummary ?? null,
    pathologySummary: input.pathologySummary ?? null,
    complicationsJson: input.complicationsJson ?? null,
    treatmentSinceLastVisit: input.treatmentSinceLastVisit ?? null,
    plan: input.plan ?? null,
    nextVisitDate: input.nextVisitDate ?? null,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };

  await db.runAsync(
    `INSERT OR REPLACE INTO follow_ups (
      id, patient_id, visit_date, visit_type, postoperative_month, complaint, findings,
      pain_vas, ecog, karnofsky, msts_score, local_recurrence_status, metastasis_status,
      lung_metastasis_status, wound_status, implant_status, union_status, weight_bearing_status,
      rom_summary, imaging_summary, pathology_summary, complications_json,
      treatment_since_last_visit, plan, next_visit_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      followUp.id,
      followUp.patientId,
      followUp.visitDate,
      followUp.visitType,
      followUp.postoperativeMonth,
      followUp.complaint,
      followUp.findings,
      followUp.painVas,
      followUp.ecog,
      followUp.karnofsky,
      followUp.mstsScore,
      followUp.localRecurrenceStatus,
      followUp.metastasisStatus,
      followUp.lungMetastasisStatus,
      followUp.woundStatus,
      followUp.implantStatus,
      followUp.unionStatus,
      followUp.weightBearingStatus,
      followUp.romSummary,
      followUp.imagingSummary,
      followUp.pathologySummary,
      followUp.complicationsJson,
      followUp.treatmentSinceLastVisit,
      followUp.plan,
      followUp.nextVisitDate,
      followUp.createdAt,
      followUp.updatedAt,
    ]
  );

  return followUp;
}

export async function deleteFollowUp(id: string) {
  const db = await getDb();
  await db.runAsync(`DELETE FROM follow_ups WHERE id = ?;`, [id]);
}
