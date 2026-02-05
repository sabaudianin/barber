export const VisitButton = () => {
  return (
    <button
      type="button"
      role="button"
      onClick={() => console.log("Umowiona wizyta")}
      className=" md:inline-flex font-lime  py-2 px-4 bg-[var(--color-accent)] shadow-lg shadow-amber-400/30 rounded font-semibold  hover:shadow-amber-400/50 shiny-btn"
    >
      Umów wizytę
    </button>
  );
};
