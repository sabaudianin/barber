"use client";
import { useState } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { pl } from "react-day-picker/locale";

export function Calendar() {
  const [selected, setSelected] = useState<Date>();

  return (
    <section className="text-center flex justify-center items-center">
      <DayPicker
        locale={pl}
        animate
        mode="single"
        selected={selected}
        onSelect={setSelected}
        footer={
          selected
            ? `Selected: ${selected.toLocaleDateString()}`
            : "Pick a day."
        }
        classNames={{
          today: `font-extrabold text-amber-100 border-amber-900 border-2 rounded-4xl`,
          selected: `bg-amber-500 border-amber-500 text-white rounded-3xl`, // Highlight the selected day

          chevron: " fill-amber-900",
          footer: "text-amber-300 font-extrabold",
          caption_label: "text-amber-700",
          head_row: "flex",
          head_cell: "text-amber-400 font-bold w-10 text-center",
        }}
      />
    </section>
  );
}
