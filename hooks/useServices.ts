import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/features/api/bookingApi";
import type { Service } from "@/types/types";

export const useServices = () => {
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 5000,
  });
};
