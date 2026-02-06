import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateBookingPayload } from "@/lib/schemas/booking";
import { createBooking } from "@/features/api/bookingApi";

export const useCreateBooking = (contextQuery: {
  barberId: string;
  serviceId: string;
  month: string;
  date: string | null;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),

    onSuccess: async () => {
      // odświeżamy kropki
      await queryClient.invalidateQueries({
        queryKey: [
          "availabilityMonth",
          contextQuery.barberId,
          contextQuery.serviceId,
          contextQuery.month,
        ],
      });
      // odświeżamy sloty
      if (contextQuery) {
        await queryClient.invalidateQueries({
          queryKey: [
            "availabilityDay",
            contextQuery.barberId,
            contextQuery.serviceId,
            contextQuery.date,
          ],
        });
      }
    },
  });
};
