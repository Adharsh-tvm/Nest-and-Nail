"use server";

import { blockWorkerDatesApi, getWorkerBlockedDatesApi } from "@/sources/api/worker/slot.api";

export async function blockWorkerDatesAction(dates: string[], slotTypes: string[]) {
  return await blockWorkerDatesApi(dates, slotTypes);
}

export async function getWorkerBlockedDatesAction() {
  return await getWorkerBlockedDatesApi();
}
