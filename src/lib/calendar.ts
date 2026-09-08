import { toIsoDate } from "@/lib/date-utils";

export type CalendarTrip = {
  id: string;
  title: string;
  destination: string;
  startDate: Date | string;
  endDate: Date | string;
};

export type CalendarDay = {
  date: Date;
  iso: string;
  inMonth: boolean;
  trips: CalendarTrip[];
};

export { toIsoDate };

export function buildMonthGrid(year: number, month: number, trips: CalendarTrip[]) {
  const first = new Date(Date.UTC(year, month, 1));
  const startWeekday = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: CalendarDay[] = [];

  for (let i = 0; i < startWeekday; i += 1) {
    const date = new Date(Date.UTC(year, month, i - startWeekday + 1));
    cells.push({ date, iso: toIsoDate(date), inMonth: false, trips: [] });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(Date.UTC(year, month, day));
    const iso = toIsoDate(date);
    cells.push({
      date,
      iso,
      inMonth: true,
      trips: trips.filter((trip) => {
        const start = toIsoDate(trip.startDate);
        const end = toIsoDate(trip.endDate);
        return iso >= start && iso <= end;
      }),
    });
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    const date = new Date(last.getTime() + 24 * 60 * 60 * 1000);
    cells.push({ date, iso: toIsoDate(date), inMonth: false, trips: [] });
  }

  return cells;
}