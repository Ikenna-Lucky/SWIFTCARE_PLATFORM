import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, inView].
 * Attach `ref` to any DOM element — `inView` flips to true the moment
 * that element enters the viewport and stays true (fires once).
 *
 * @param {IntersectionObserverInit} options - Optional IntersectionObserver overrides.
 */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el); // Only animate once — no re-trigger on scroll back up
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px", ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

export default useInView;
