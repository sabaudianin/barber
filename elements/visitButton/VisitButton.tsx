import Link from "next/link";
export const VisitButton = () => {
  return (
    <Link
      href="/wizyta"
      className=" md:inline-flex font-lime  py-2 px-4 bg-[var(--color-accent)] shadow-lg shadow-amber-400/30 rounded font-semibold  hover:shadow-amber-400/50 shiny-btn"
    >
      Umów wizytę
    </Link>
  );
};
