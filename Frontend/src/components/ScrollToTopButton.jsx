import { useEffect, useState } from "react";

/**
 * Floating scroll-to-top button.
 * - Hidden until the user scrolls more than 300px down the page.
 * - Smooth-scrolls back to the top on click.
 * - Uses CSS opacity/translate transitions so it fades+slides in/out gracefully.
 */
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed bottom-6 right-6 z-50
        w-11 h-11 rounded-full
        bg-primary text-white shadow-lg
        flex items-center justify-center
        transition-all duration-300
        hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-primary/40
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
