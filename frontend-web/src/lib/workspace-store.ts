export type WorkspaceRadiologyRecord = {
  id: string;
  domain: string;
  fileNames: string[];
  totalFiles: number;
  dicomFiles: number;
  rasterFiles: number;
  createdAt: string;
};

export type WorkspaceFollowUpRecord = {
  id: string;
  visitDate: string;
  diseaseStatus: string;
  treatmentPlan: string;
  controlDate: string;
  note: string;
  createdAt: string;
};

export type WorkspacePatient = {
  id: string;
  fullName: string;
  uniqueId: string;
  diagnosis: string;
  stage: string;
  pathology: string;
  treatmentPlan: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  radiology: WorkspaceRadiologyRecord[];
  followUps: WorkspaceFollowUpRecord[];
};

const STORAGE_KEY = 'tumorarchives.workspace.patients';
const ACTIVE_PATIENT_KEY = 'tumorarchives.workspace.activePatientId';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadWorkspacePatients(): WorkspacePatient[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WorkspacePatient[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWorkspacePatients(patients: WorkspacePatient[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

export function getActivePatientId(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(ACTIVE_PATIENT_KEY);
}

export function setActivePatientId(patientId: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ACTIVE_PATIENT_KEY, patientId);
}

export function clearActivePatientId() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ACTIVE_PATIENT_KEY);
}

export function createEmptyPatient(): WorkspacePatient {
  const now = new Date().toISOString();
  return {
    id: generateId('patient'),
    fullName: '',
    uniqueId: '',
    diagnosis: '',
    stage: '',
    pathology: '',
    treatmentPlan: '',
    notes: '',
    createdAt: now,
    updatedAt: now,
    radiology: [],
    followUps: [],
  };
}

export function upsertWorkspacePatient(input: WorkspacePatient): WorkspacePatient[] {
  const patients = loadWorkspacePatients();
  const updated = {
    ...input,
    updatedAt: new Date().toISOString(),
  };
  const existingIndex = patients.findIndex((patient) => patient.id === input.id);

  if (existingIndex >= 0) {
    patients[existingIndex] = updated;
  } else {
    patients.unshift(updated);
  }

  saveWorkspacePatients(patients);
  setActivePatientId(updated.id);
  return patients;
}

export function appendRadiologyRecord(patientId: string, record: Omit<WorkspaceRadiologyRecord, 'id' | 'createdAt'>): WorkspacePatient[] {
  const patients = loadWorkspacePatients();
  const now = new Date().toISOString();
  const next = patients.map((patient) => {
    if (patient.id !== patientId) return patient;
    return {
      ...patient,
      updatedAt: now,
      radiology: [
        {
          id: generateId('radiology'),
          createdAt: now,
          ...record,
        },
        ...patient.radiology,
      ],
    };
  });

  saveWorkspacePatients(next);
  setActivePatientId(patientId);
  return next;
}

export function appendFollowUpRecord(patientId: string, record: Omit<WorkspaceFollowUpRecord, 'id' | 'createdAt'>): WorkspacePatient[] {
  const patients = loadWorkspacePatients();
  const now = new Date().toISOString();
  const next = patients.map((patient) => {
    if (patient.id !== patientId) return patient;
    return {
      ...patient,
      updatedAt: now,
      followUps: [
        {
          id: generateId('followup'),
          createdAt: now,
          ...record,
        },
        ...patient.followUps,
      ],
    };
  });

  saveWorkspacePatients(next);
  setActivePatientId(patientId);
  return next;
}
