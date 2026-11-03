import { useEffect } from "react";

/**
 * Adds `.active` to every [data-section] once its top edge crosses the
 * vertical middle of the viewport. It never removes the class, so each
 * section reveals once.
 */
export function revealSections() {
  document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight / 2) {
      el.classList.add("active");
    }
  });
}

export function useScrollReveal() {
  useEffect(() => {
    revealSections();
    window.addEventListener("scroll", revealSections, { passive: true });
    return () => window.removeEventListener("scroll", revealSections);
  }, []);
}
