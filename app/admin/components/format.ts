export function formatDateHeading(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(value: string) {
  const [hour, minute] = value.split(":").map((item) => Number(item));
  const normalizedHour = Number.isFinite(hour) ? hour : 0;
  const normalizedMinute = Number.isFinite(minute) ? minute : 0;
  const period = normalizedHour >= 12 ? "PM" : "AM";
  const twelveHour = normalizedHour % 12 || 12;
  return `${twelveHour}:${String(normalizedMinute).padStart(2, "0")} ${period}`;
}

export function statusClasses(status: string) {
  if (status === "confirmed") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-slate-200 text-slate-700";
  if (status === "completed") return "bg-blue-100 text-blue-700";
  if (status === "no_show") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-600";
}
