import { SlotType } from "../shared/enums/slotEnums";

export function getVideoSlotTime(slotType: SlotType, baseDate: Date) {
  const date = new Date(baseDate);

  const setTime = (h: number, m: number) => {
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  };

  switch (slotType) {
    case SlotType.VIDEO_SLOT_1:
      return { start: setTime(20, 0), end: setTime(20, 15) };

    case SlotType.VIDEO_SLOT_2:
      return { start: setTime(20, 15), end: setTime(20, 30) };

    case SlotType.VIDEO_SLOT_3:
      return { start: setTime(20, 30), end: setTime(20, 45) };

    case SlotType.VIDEO_SLOT_4:
      return { start: setTime(20, 45), end: setTime(21, 0) };

    default:
      throw new Error("Invalid video slot");
  }
}