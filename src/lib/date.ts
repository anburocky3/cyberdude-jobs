import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

let isExtended = false;

function ensureExtended() {
  if (!isExtended) {
    dayjs.extend(relativeTime);
    isExtended = true;
  }
}

export function fromNow(dateInput?: string | null): string {
  ensureExtended();
  if (!dateInput) return "—";
  const d = dayjs(dateInput);
  if (!d.isValid()) return "—";
  return d.fromNow();
}

export function formatDate(
  dateInput?: string | null | Date,
  format: string = "DD/MM/YYYY"
): string {
  if (!dateInput) return "—";
  const d = dayjs(dateInput);
  if (!d.isValid()) return "—";
  return d.format(format);
}
