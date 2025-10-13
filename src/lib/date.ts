import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

let isExtended = false;

function ensureExtended() {
  if (!isExtended) {
    dayjs.extend(relativeTime);
    dayjs.extend(utc);
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
  format: string = "DD/MM/YYYY",
  useUTC: boolean = false
): string {
  ensureExtended();
  if (!dateInput) return "—";
  const d = useUTC ? dayjs.utc(dateInput) : dayjs(dateInput);
  if (!d.isValid()) return "—";
  return d.format(format);
}
