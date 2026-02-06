import { useQuery } from "@tanstack/react-query";
import { fetchAvailabilityMonth } from "@/features/api/bookingApi";

export function useAvailabilityMonth(params: {
  barberId: string;
  serviceId: string;
  month: string;
}) {
  return useQuery({
    queryKey: [
      "availibilityMonth",
      params.barberId,
      params.serviceId,
      params.month,
    ],
    queryFn: () => fetchAvailabilityMonth(params),
    enabled: !!params.barberId && !!params.serviceId && !!params.month,
    staleTime: 5000,
  });
}
