/**
 * Structural animation settings using Dynamic Motion properties.
 */
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.25 }
  },
  slideInUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  slideInLateral: {
    initial: { opacity: 0, x: -16 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.25 }
  },
  hoverScale: {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.99 }
  },
  tapOnly: {
    whileTap: { scale: 0.95 }
  }
};
