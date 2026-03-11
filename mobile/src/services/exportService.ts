import { Directory, File, Paths } from 'expo-file-system';
import { listFollowUps } from '@/src/repositories/followUps';
import { listPatientImages } from '@/src/repositories/images';
import { listPatients } from '@/src/repositories/patients';

function ensureExportDir() {
  const dir = new Directory(Paths.document, 'exports');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

async function anonymizePatient(patient: any, index: number) {
  const followUps = await listFollowUps(patient.id);
  const images = await listPatientImages(patient.id);
  const lastFollowUp = followUps[0];

  return {
    case_id: `T-${String(index + 1).padStart(4, '0')}`,
    age: patient.age ?? null,
    gender: patient.gender ?? null,
    diagnosisDate: patient.diagnosisDate ?? null,
    tumorOrigin: patient.tumorOrigin ?? null,
    tumorBehavior: patient.tumorBehavior ?? null,
    tumorType: patient.tumorType ?? null,
    tumorSubtype: patient.tumorSubtype ?? null,
    tumorLocation: patient.tumorLocation ?? null,
    boneSegment: patient.boneSegment ?? null,
    tumorSide: patient.tumorSide ?? null,
    ennekingStage: patient.ennekingStage ?? null,
    ajccT: patient.ajccT ?? null,
    ajccN: patient.ajccN ?? null,
    ajccM: patient.ajccM ?? null,
    histologicGrade: patient.histologicGrade ?? null,
    tumorSizeCm: patient.tumorSizeCm ?? null,
    metastaticAtDiagnosis: patient.metastaticAtDiagnosis ?? null,
    pathologicalFracture: patient.pathologicalFracture ?? null,
    surgeryDate: patient.surgeryDate ?? null,
    surgeryType: patient.surgeryType ?? null,
    reconstruction: patient.reconstruction ?? null,
    implantType: patient.implantType ?? null,
    neoadjuvantChemo: patient.neoadjuvantChemo ?? null,
    adjuvantChemo: patient.adjuvantChemo ?? null,
    chemoProtocol: patient.chemoProtocol ?? null,
    radiotherapy: patient.radiotherapy ?? null,
    radiotherapyDoseGy: patient.radiotherapyDoseGy ?? null,
    surgicalMargin: patient.surgicalMargin ?? null,
    localRecurrence: patient.localRecurrence ?? null,
    metastasis: patient.metastasis ?? null,
    currentStatus: patient.currentStatus ?? null,
    followUpCount: followUps.length,
    imageCount: images.length,
    lastFollowUpDate: lastFollowUp ? new Date(lastFollowUp.visitDate).toISOString().slice(0, 10) : null,
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
  };
}

export async function exportAnonymizedJson() {
  const patients = await listPatients();
  const payload = await Promise.all(patients.map(anonymizePatient));
  const dir = ensureExportDir();
  const file = new File(dir, `tumorarchives-export-${Date.now()}.json`);
  file.create();
  file.write(JSON.stringify(payload, null, 2));
  return file.uri;
}

export async function exportAnonymizedCsv() {
  const patients = await listPatients();
  const rows = await Promise.all(patients.map(anonymizePatient));
  const headers = Object.keys(rows[0] ?? { case_id: '' });
  const lines = [headers.join(';')];
  for (const row of rows) {
    lines.push(headers.map((header) => `"${String((row as any)[header] ?? '').replace(/"/g, '""')}"`).join(';'));
  }
  const dir = ensureExportDir();
  const file = new File(dir, `tumorarchives-export-${Date.now()}.csv`);
  file.create();
  file.write(`\uFEFF${lines.join('\n')}`);
  return file.uri;
}
