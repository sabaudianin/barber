import { DateTime } from "luxon";

export const ZONE = "Europe/Warsaw";
export const STEP_MINUTES = 30;

export const toISODate = (date: Date): string => {
  const iso = DateTime.fromJSDate(date).setZone(ZONE).toISODate();
  if (!iso) throw new Error("Invalid date");
  return iso;
};

export const toMonthString = (date: Date): string => {
  return DateTime.fromJSDate(date).setZone(ZONE).toFormat("yyyy-MM");
};
