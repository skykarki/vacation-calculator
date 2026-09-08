import { prisma } from "@/lib/db";

export async function getOwnedTrip(tripId: string, userId: string) {
  return prisma.trip.findFirst({
    where: { id: tripId, userId },
  });
}

export function isTripOwner(
  trip: { userId: string } | null,
  userId: string,
) {
  return !!trip && trip.userId === userId;
}
