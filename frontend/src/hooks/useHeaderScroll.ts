import { useEffect, useState } from "react";

/**
 * Header behaviour:
 *  - `active`: page scrolled past 150px -> header becomes fixed and slides down into view
 *  - `hidden`: scrolling down hides it (slides up), scrolling up shows it again
 */
export function useHeaderScroll() {
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrolledPos = 0;

    const onScroll = () => {
      const y = window.scrollY;
      setActive(y > 150);
      setHidden(!(lastScrolledPos >= y));
      lastScrolledPos = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { active, hidden };
}
