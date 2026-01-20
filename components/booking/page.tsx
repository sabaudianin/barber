"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { DateTime } from "luxon";

type Barber = { id: string; name: string };
type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
};

const ZONE = "Europe/Warsaw";

function toISODate(date: Date): string {
  const iso = DateTime.fromJSDate(date).setZone(ZONE).toISODate();
  if (!iso) throw new Error("Invalid date");
  return iso;
}

export default function BookingPage() {
  //dane z backendu
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  //wybrane barbery i suługi
  const [selectedBarberID, setSelectedBarberID] = useState<string>("");
  const [selectedServiceID, setSelectedServiceID] = useState<string>("");

  //strona sie ładuje pobieramy barberów i usługi
  useEffect(() => {
    async function loadInitialData() {
      const [bRes, sRes] = await Promise.all([
        fetch("/api/barbers"),
        fetch("/api/services"),
      ]);
      const [barb, serv] = await Promise.all([bRes.json(), sRes.json()]);
      setBarbers(serv);
      setServices(serv);

      //ustawiamy defaultowe zaznaczenia
      if (barb?.[0]?.id) {
        setSelectedBarberID(barb[0].id);
      }
      if (serv?.[0]?.id) {
        setSelectedServiceID(serv[0].id);
      }
    }
    loadInitialData();
  }, []);
}
