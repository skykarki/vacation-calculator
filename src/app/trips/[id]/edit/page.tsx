import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TripForm } from "@/components/TripForm";
import { toIsoDate } from "@/lib/date-utils";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      destination: true,
      startDate: true,
      endDate: true,
      totalDays: true,
      notes: true,
      userId: true,
    },
  });

  if (!trip || trip.userId !== session.user.id) {
    notFound();
  }

  return (
    <TripForm
      tripId={trip.id}
      initialValues={{
        title: trip.title,
        destination: trip.destination,
        startDate: toIsoDate(trip.startDate),
        endDate: toIsoDate(trip.endDate),
        totalDays: trip.totalDays,
        notes: trip.notes ?? "",
      }}
    />
  );
}
