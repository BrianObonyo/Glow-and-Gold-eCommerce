import { useEffect, type ReactNode } from "react";
import { revealSections } from "../hooks/useScrollReveal";

/** A page section whose direct children fade/slide in when scrolled into view. */
export default function Section({ className = "", id, children }: { className?: string; id?: string; children: ReactNode }) {
  useEffect(() => {
    revealSections();
  }, []);

  return (
    <section className={`section ${className}`} id={id} data-section>
      {children}
    </section>
  );
}
