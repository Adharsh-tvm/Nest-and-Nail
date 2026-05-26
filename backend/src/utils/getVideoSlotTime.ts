import { SlotType } from "../shared/enums/slotEnums";

function getUtcDateForIstSlot(baseDate: Date, hour: number, minute: number): Date {
  const d = new Date(baseDate);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const date = d.getUTCDate();
  
  // Create a UTC Date representing the slot time in IST (+5:30)
  const utcDate = new Date(Date.UTC(year, month, date, hour, minute, 0, 0));
  // Subtract 5.5 hours in milliseconds to convert IST to UTC
  utcDate.setTime(utcDate.getTime() - (5.5 * 60 * 60 * 1000));
  return utcDate;
}

export function getVideoSlotTime(slotType: SlotType, baseDate: Date) {
  switch (slotType) {
    case SlotType.VIDEO_SLOT_1:
      return { 
        start: getUtcDateForIstSlot(baseDate, 20, 0), 
        end: getUtcDateForIstSlot(baseDate, 20, 15) 
      };

    case SlotType.VIDEO_SLOT_2:
      return { 
        start: getUtcDateForIstSlot(baseDate, 20, 15), 
        end: getUtcDateForIstSlot(baseDate, 20, 30) 
      };

    case SlotType.VIDEO_SLOT_3:
      return { 
        start: getUtcDateForIstSlot(baseDate, 20, 30), 
        end: getUtcDateForIstSlot(baseDate, 20, 45) 
      };

    case SlotType.VIDEO_SLOT_4:
      return { 
        start: getUtcDateForIstSlot(baseDate, 20, 45), 
        end: getUtcDateForIstSlot(baseDate, 21, 0) 
      };

    default:
      throw new Error("Invalid video slot");
  }
}