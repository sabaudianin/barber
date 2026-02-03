import { DateTime } from "luxon";

export const ZONE = "Europe/Warsaw";
export const STEP_MINUTES = 30;
export const BOOKING_AFTER_MIN = 30;

export const toDateIso = (date: DateTime): string => {
  const iso = date.setZone(ZONE).toISODate();
  if (!iso) throw new Error("Invalid date");
  return iso;
};

export const toJsDateIso = (date: Date): string => {
  const iso = DateTime.fromJSDate(date).setZone(ZONE).toISODate();
  if (!iso) throw new Error("Invalid date");
  return iso;
};

export const toMonthString = (date: Date): string => {
  return DateTime.fromJSDate(date).setZone(ZONE).toFormat("yyyy-MM");
};
