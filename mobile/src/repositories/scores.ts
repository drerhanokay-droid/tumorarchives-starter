import { getDb } from '@/src/db';
import type { ScoreRecord } from '@/src/types';

export async function saveScore(record: Omit<ScoreRecord, 'id' | 'createdAt'>) {
  const db = await getDb();
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  await db.runAsync(
    `INSERT INTO scores (id, patient_id, scoring_system, total_score, interpretation, answers_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [id, record.patientId, record.scoringSystem, record.totalScore, record.interpretation ?? null, record.answersJson, createdAt]
  );
}

export async function listScores(patientId: string) {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT * FROM scores WHERE patient_id = ? ORDER BY created_at DESC;`,
    [patientId]
  );
}
