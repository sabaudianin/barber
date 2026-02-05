import { useQuery } from "@tanstack/react-query";
import { fetchBarbers } from "@/features/api/bookingApi";
import type { Barber } from "@/types/types";

export const useBarbers = () => {
  return useQuery<Barber[]>({
    queryKey: ["barbers"],
    queryFn: fetchBarbers,
    staleTime: 5000,
  });
};
