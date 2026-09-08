import { prisma } from "@/lib/db";

export type TripStatSource = {
  destination: string;
  startDate: Date;
  totalDays: number;
};

export function getYearlyTravelStatsFromTrips(
  trips: TripStatSource[],
  year: number,
) {
  const inYear = trips.filter((trip) => trip.startDate.getFullYear() === year);
  const totalDays = inYear.reduce((sum, trip) => sum + trip.totalDays, 0);

  return {
    totalDays,
    totalTrips: inYear.length,
    uniqueDestinations: new Set(inYear.map((trip) => trip.destination)).size,
    totalMonths: +(totalDays / 30).toFixed(1),
  };
}

export async function getYearlyTravelStats(userId: string, year: number) {
  const trips = await prisma.trip.findMany({
    where: {
      userId,
      startDate: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
    select: { destination: true, startDate: true, totalDays: true },
  });

  return getYearlyTravelStatsFromTrips(trips, year);
}

export function getNextUpcomingTripFromTrips<T extends { startDate: Date }>(
  trips: T[],
  now = new Date(),
) {
  return trips.find((trip) => trip.startDate >= now) ?? null;
}

export async function getNextUpcomingTrip(userId: string) {
  return prisma.trip.findFirst({
    where: { userId, startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
  });
}

export function summarizeExpenses(
  expenses: { category: string; amount: number }[],
) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  return { total, byCategory };
}

export async function getTripBudgetSummary(tripId: string) {
  const expenses = await prisma.expense.findMany({
    where: { tripId },
    select: { category: true, amount: true },
  });
  return summarizeExpenses(expenses);
}
