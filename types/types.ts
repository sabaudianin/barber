export type Barber = { id: string; name: string };

export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
};

export type Toast = { type: "success" | "error"; message: string } | null;
