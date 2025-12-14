"use server"

import { saveWorkerSkills, uploadWorkerCertDocument, uploadWorkerIdDocument } from "@/services/api/worker.api";

export async function saveWorkerSkillsAction(
  workerId: string,
  skills: string[]
) {
  return await saveWorkerSkills(workerId, skills);
}


export async function uploadIdDocumentAction(
  workerId: string,
  file: File
) {
  return await uploadWorkerIdDocument(workerId, file);
}

/* ---------------- CERT DOCUMENT ---------------- */

export async function uploadCertDocumentAction(
  workerId: string,
  file: File
) {
  return await uploadWorkerCertDocument(workerId, file);
}