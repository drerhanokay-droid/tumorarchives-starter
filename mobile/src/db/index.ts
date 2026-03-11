import * as SQLite from 'expo-sqlite';
import { getOrCreateDatabaseKey } from '@/src/security/keys';

let database: SQLite.SQLiteDatabase | null = null;

const migrations = [
  `CREATE TABLE IF NOT EXISTS app_meta (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER,
    date_of_birth TEXT,
    gender TEXT,
    phone TEXT,
    national_id_masked TEXT,
    protocol_no TEXT,
    hospital_name TEXT,
    referring_clinic TEXT,
    diagnosis_date TEXT,
    biopsy_date TEXT,
    pathology_report_no TEXT,
    tumor_origin TEXT,
    tumor_behavior TEXT,
    tumor_type TEXT,
    tumor_subtype TEXT,
    tumor_location TEXT,
    bone_segment TEXT,
    tumor_side TEXT,
    compartment_status TEXT,
    enneking_stage TEXT,
    ajcc_t TEXT,
    ajcc_n TEXT,
    ajcc_m TEXT,
    histologic_grade TEXT,
    tumor_size_cm REAL,
    metastatic_at_diagnosis TEXT,
    skip_metastasis TEXT,
    pathological_fracture TEXT,
    biopsy_type TEXT,
    surgery_date TEXT,
    surgery_type TEXT,
    surgery_intent TEXT,
    reconstruction TEXT,
    implant_type TEXT,
    neoadjuvant_chemo TEXT,
    adjuvant_chemo TEXT,
    chemo_protocol TEXT,
    radiotherapy TEXT,
    radiotherapy_dose_gy REAL,
    surgical_margin TEXT,
    necrosis_rate_pct REAL,
    local_recurrence TEXT,
    local_recurrence_date TEXT,
    metastasis TEXT,
    metastasis_date TEXT,
    current_status TEXT,
    death_date TEXT,
    last_contact_date TEXT,
    notes TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );`,
  `CREATE INDEX IF NOT EXISTS idx_patients_protocol_no ON patients(protocol_no);`,
  `CREATE INDEX IF NOT EXISTS idx_patients_tumor_type ON patients(tumor_type);`,
  `CREATE INDEX IF NOT EXISTS idx_patients_updated_at ON patients(updated_at);`,
  `CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY NOT NULL,
    patient_id TEXT NOT NULL,
    file_uri TEXT NOT NULL,
    thumbnail_uri TEXT,
    label TEXT,
    image_type TEXT,
    modality TEXT,
    body_part TEXT,
    body_side TEXT,
    source_type TEXT,
    captured_at TEXT,
    mime_type TEXT,
    file_size_bytes INTEGER,
    width INTEGER,
    height INTEGER,
    checksum TEXT,
    notes TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_images_patient_id ON images(patient_id);`,
  `CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY NOT NULL,
    patient_id TEXT NOT NULL,
    scoring_system TEXT NOT NULL,
    total_score INTEGER NOT NULL,
    interpretation TEXT,
    answers_json TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_scores_patient_id ON scores(patient_id);`,
  `CREATE TABLE IF NOT EXISTS follow_ups (
    id TEXT PRIMARY KEY NOT NULL,
    patient_id TEXT NOT NULL,
    visit_date INTEGER NOT NULL,
    visit_type TEXT,
    postoperative_month REAL,
    complaint TEXT,
    findings TEXT,
    pain_vas REAL,
    ecog INTEGER,
    karnofsky INTEGER,
    msts_score INTEGER,
    local_recurrence_status TEXT,
    metastasis_status TEXT,
    lung_metastasis_status TEXT,
    wound_status TEXT,
    implant_status TEXT,
    union_status TEXT,
    weight_bearing_status TEXT,
    rom_summary TEXT,
    imaging_summary TEXT,
    pathology_summary TEXT,
    complications_json TEXT,
    treatment_since_last_visit TEXT,
    plan TEXT,
    next_visit_date INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_followups_patient_id ON follow_ups(patient_id);`,
  `CREATE INDEX IF NOT EXISTS idx_followups_visit_date ON follow_ups(visit_date);`,
];

export async function getDb() {
  if (database) return database;

  const key = await getOrCreateDatabaseKey();
  database = await SQLite.openDatabaseAsync('tumorarchives.db');
  await database.execAsync('PRAGMA foreign_keys = ON;');
  await database.execAsync(`PRAGMA key = '${key}';`);
  await runMigrations(database);
  return database;
}

async function runMigrations(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY NOT NULL, value TEXT);`);
  const current = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM app_meta WHERE key = 'schema_version';`
  );
  const currentVersion = Number(current?.value ?? 0);

  for (let i = currentVersion; i < migrations.length; i += 1) {
    await db.execAsync('BEGIN;');
    try {
      await db.execAsync(migrations[i]);
      await db.runAsync(
        `INSERT OR REPLACE INTO app_meta (key, value) VALUES ('schema_version', ?);`,
        [(i + 1).toString()]
      );
      await db.execAsync('COMMIT;');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  }
}
