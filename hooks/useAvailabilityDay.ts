import { useQuery } from "@tanstack/react-query";
import { fetchAvailabilityDay } from "@/features/api/bookingApi";

export function useAvailabilityDay(params: {
  barberId: string;
  serviceId: string;
  date: string | null;
}) {
  const enabled = Boolean(params.barberId && params.serviceId && params.date);
  return useQuery({
    queryKey: [
      "availabilityDay",
      params.barberId,
      params.serviceId,
      params.date,
    ],
    queryFn: () =>
      fetchAvailabilityDay({
        barberId: params.barberId,
        serviceId: params.serviceId,
        date: params.date!,
      }),
    enabled,
    staleTime: 3000,
  });
}
