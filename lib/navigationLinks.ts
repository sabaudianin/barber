export type NavLink = {
  name: string;
  url: string;
};

export const navLinks: NavLink[] = [
  { name: "Strona Główna", url: "/" },
  { name: "Umów wizytę", url: "/wizyta" },
  { name: "Galeria", url: "/galeria" },
  { name: "Kontakt", url: "/kontakt" },
];
