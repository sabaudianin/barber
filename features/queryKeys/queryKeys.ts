export const bookingKeys = {
  all: ["booking"] as const,

  barbers: () => [...bookingKeys.all, "barbers"] as const,
  services: () => [...bookingKeys.all, "services"] as const,

  availabilityMonth: (p: {
    barberId: string;
    serviceId: string;
    month: string;
  }) => [...bookingKeys.all, "availabilityMonth", p] as const,

  availabilityDay: (p: { barberId: string; serviceId: string; date: string }) =>
    [...bookingKeys.all, "availabilityDay", p] as const,
};
