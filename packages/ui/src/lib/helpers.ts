import { addDays, differenceInHours } from "date-fns";

export function calculateRemainingHours(timestamp: number): number {
  const dueDate = addDays(new Date(timestamp), 1);
  const remainingHours = differenceInHours(dueDate, new Date());

  return Math.max(0, remainingHours);
}
