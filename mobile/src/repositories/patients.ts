import { getDb } from '@/src/db';
import type { Patient } from '@/src/types';

function mapRow(row: any): Patient {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    age: row.age,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    phone: row.phone,
    nationalIdMasked: row.national_id_masked,
    protocolNo: row.protocol_no,
    hospitalName: row.hospital_name,
    referringClinic: row.referring_clinic,
    diagnosisDate: row.diagnosis_date,
    biopsyDate: row.biopsy_date,
    pathologyReportNo: row.pathology_report_no,
    tumorOrigin: row.tumor_origin,
    tumorBehavior: row.tumor_behavior,
    tumorType: row.tumor_type,
    tumorSubtype: row.tumor_subtype,
    tumorLocation: row.tumor_location,
    boneSegment: row.bone_segment,
    tumorSide: row.tumor_side,
    compartmentStatus: row.compartment_status,
    ennekingStage: row.enneking_stage,
    ajccT: row.ajcc_t,
    ajccN: row.ajcc_n,
    ajccM: row.ajcc_m,
    histologicGrade: row.histologic_grade,
    tumorSizeCm: row.tumor_size_cm,
    metastaticAtDiagnosis: row.metastatic_at_diagnosis,
    skipMetastasis: row.skip_metastasis,
    pathologicalFracture: row.pathological_fracture,
    biopsyType: row.biopsy_type,
    surgeryDate: row.surgery_date,
    surgeryType: row.surgery_type,
    surgeryIntent: row.surgery_intent,
    reconstruction: row.reconstruction,
    implantType: row.implant_type,
    neoadjuvantChemo: row.neoadjuvant_chemo,
    adjuvantChemo: row.adjuvant_chemo,
    chemoProtocol: row.chemo_protocol,
    radiotherapy: row.radiotherapy,
    radiotherapyDoseGy: row.radiotherapy_dose_gy,
    surgicalMargin: row.surgical_margin,
    necrosisRatePct: row.necrosis_rate_pct,
    localRecurrence: row.local_recurrence,
    localRecurrenceDate: row.local_recurrence_date,
    metastasis: row.metastasis,
    metastasisDate: row.metastasis_date,
    currentStatus: row.current_status,
    deathDate: row.death_date,
    lastContactDate: row.last_contact_date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPatients(search?: string) {
  const db = await getDb();
  if (!search?.trim()) {
    const rows = await db.getAllAsync(`SELECT * FROM patients ORDER BY updated_at DESC;`);
    return rows.map(mapRow);
  }

  const q = `%${search.trim()}%`;
  const rows = await db.getAllAsync(
    `SELECT * FROM patients
     WHERE first_name LIKE ?
        OR last_name LIKE ?
        OR tumor_type LIKE ?
        OR tumor_subtype LIKE ?
        OR tumor_location LIKE ?
        OR protocol_no LIKE ?
        OR pathology_report_no LIKE ?
     ORDER BY updated_at DESC;`,
    [q, q, q, q, q, q, q]
  );
  return rows.map(mapRow);
}

export async function getPatientById(id: string) {
  const db = await getDb();
  const row = await db.getFirstAsync(`SELECT * FROM patients WHERE id = ?;`, [id]);
  return row ? mapRow(row) : null;
}

export async function upsertPatient(input: Partial<Patient> & Pick<Patient, 'firstName' | 'lastName'>) {
  const db = await getDb();
  const now = Date.now();
  const patient: Patient = {
    id: input.id ?? crypto.randomUUID(),
    firstName: input.firstName,
    lastName: input.lastName,
    age: input.age ?? null,
    dateOfBirth: input.dateOfBirth ?? null,
    gender: input.gender ?? null,
    phone: input.phone ?? null,
    nationalIdMasked: input.nationalIdMasked ?? null,
    protocolNo: input.protocolNo ?? null,
    hospitalName: input.hospitalName ?? null,
    referringClinic: input.referringClinic ?? null,
    diagnosisDate: input.diagnosisDate ?? null,
    biopsyDate: input.biopsyDate ?? null,
    pathologyReportNo: input.pathologyReportNo ?? null,
    tumorOrigin: input.tumorOrigin ?? null,
    tumorBehavior: input.tumorBehavior ?? null,
    tumorType: input.tumorType ?? null,
    tumorSubtype: input.tumorSubtype ?? null,
    tumorLocation: input.tumorLocation ?? null,
    boneSegment: input.boneSegment ?? null,
    tumorSide: input.tumorSide ?? null,
    compartmentStatus: input.compartmentStatus ?? null,
    ennekingStage: input.ennekingStage ?? null,
    ajccT: input.ajccT ?? null,
    ajccN: input.ajccN ?? null,
    ajccM: input.ajccM ?? null,
    histologicGrade: input.histologicGrade ?? null,
    tumorSizeCm: input.tumorSizeCm ?? null,
    metastaticAtDiagnosis: input.metastaticAtDiagnosis ?? null,
    skipMetastasis: input.skipMetastasis ?? null,
    pathologicalFracture: input.pathologicalFracture ?? null,
    biopsyType: input.biopsyType ?? null,
    surgeryDate: input.surgeryDate ?? null,
    surgeryType: input.surgeryType ?? null,
    surgeryIntent: input.surgeryIntent ?? null,
    reconstruction: input.reconstruction ?? null,
    implantType: input.implantType ?? null,
    neoadjuvantChemo: input.neoadjuvantChemo ?? null,
    adjuvantChemo: input.adjuvantChemo ?? null,
    chemoProtocol: input.chemoProtocol ?? null,
    radiotherapy: input.radiotherapy ?? null,
    radiotherapyDoseGy: input.radiotherapyDoseGy ?? null,
    surgicalMargin: input.surgicalMargin ?? null,
    necrosisRatePct: input.necrosisRatePct ?? null,
    localRecurrence: input.localRecurrence ?? null,
    localRecurrenceDate: input.localRecurrenceDate ?? null,
    metastasis: input.metastasis ?? null,
    metastasisDate: input.metastasisDate ?? null,
    currentStatus: input.currentStatus ?? null,
    deathDate: input.deathDate ?? null,
    lastContactDate: input.lastContactDate ?? null,
    notes: input.notes ?? null,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };

  await db.runAsync(
    `INSERT OR REPLACE INTO patients (
      id, first_name, last_name, age, date_of_birth, gender, phone, national_id_masked,
      protocol_no, hospital_name, referring_clinic, diagnosis_date, biopsy_date, pathology_report_no,
      tumor_origin, tumor_behavior, tumor_type, tumor_subtype, tumor_location, bone_segment,
      tumor_side, compartment_status, enneking_stage, ajcc_t, ajcc_n, ajcc_m, histologic_grade,
      tumor_size_cm, metastatic_at_diagnosis, skip_metastasis, pathological_fracture, biopsy_type,
      surgery_date, surgery_type, surgery_intent, reconstruction, implant_type, neoadjuvant_chemo,
      adjuvant_chemo, chemo_protocol, radiotherapy, radiotherapy_dose_gy, surgical_margin,
      necrosis_rate_pct, local_recurrence, local_recurrence_date, metastasis, metastasis_date,
      current_status, death_date, last_contact_date, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      patient.id,
      patient.firstName,
      patient.lastName,
      patient.age,
      patient.dateOfBirth,
      patient.gender,
      patient.phone,
      patient.nationalIdMasked,
      patient.protocolNo,
      patient.hospitalName,
      patient.referringClinic,
      patient.diagnosisDate,
      patient.biopsyDate,
      patient.pathologyReportNo,
      patient.tumorOrigin,
      patient.tumorBehavior,
      patient.tumorType,
      patient.tumorSubtype,
      patient.tumorLocation,
      patient.boneSegment,
      patient.tumorSide,
      patient.compartmentStatus,
      patient.ennekingStage,
      patient.ajccT,
      patient.ajccN,
      patient.ajccM,
      patient.histologicGrade,
      patient.tumorSizeCm,
      patient.metastaticAtDiagnosis,
      patient.skipMetastasis,
      patient.pathologicalFracture,
      patient.biopsyType,
      patient.surgeryDate,
      patient.surgeryType,
      patient.surgeryIntent,
      patient.reconstruction,
      patient.implantType,
      patient.neoadjuvantChemo,
      patient.adjuvantChemo,
      patient.chemoProtocol,
      patient.radiotherapy,
      patient.radiotherapyDoseGy,
      patient.surgicalMargin,
      patient.necrosisRatePct,
      patient.localRecurrence,
      patient.localRecurrenceDate,
      patient.metastasis,
      patient.metastasisDate,
      patient.currentStatus,
      patient.deathDate,
      patient.lastContactDate,
      patient.notes,
      patient.createdAt,
      patient.updatedAt,
    ]
  );

  return patient;
}

export async function deletePatient(id: string) {
  const db = await getDb();
  await db.runAsync(`DELETE FROM patients WHERE id = ?;`, [id]);
}
