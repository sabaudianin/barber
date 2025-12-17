export type NavLink = {
  name: string;
  url: string;
};

export const navLinks: NavLink[] = [
  { name: "Strona Główna", url: "/" },
  { name: "Cennik", url: "/cennik" },
  { name: "Galeria", url: "/galeria" },
  { name: "Kontakt", url: "/kontakt" },
];
