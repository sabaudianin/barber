import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Kontakt() {
  return (
    <section className="grid place-items-center py-16">
      <div className="text-center space-y-8">
        <div className="flex gap-8 justify-center text-3xl">
          <a
            href="#"
            aria-label="Facebook"
            className="hover:scale-110 transition-transform duration-200 "
          >
            <FaFacebookF />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="hover:scale-110 transition-transform duration-200 "
          >
            <FaInstagram />
          </a>

          <a
            href="#"
            aria-label="TikTok"
            className="hover:scale-110 transition-transform duration-200"
          >
            <FaTiktok />
          </a>
        </div>
      </div>
    </section>
  );
}
