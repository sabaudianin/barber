import { useQuery } from "@tanstack/react-query";
import { fetchAvailabilityMonth } from "@/features/api/bookingApi";

export function useAvailabilityMonth(params: {
  barberId: string;
  serviceId: string;
  month: string;
}) {
  const enabled = Boolean(params.barberId && params.serviceId && params.month);

  return useQuery({
    queryKey: [
      "availabilityMonth",
      params.barberId,
      params.serviceId,
      params.month,
    ],
    queryFn: () => fetchAvailabilityMonth(params),
    enabled,
    staleTime: 5000,
  });
}
