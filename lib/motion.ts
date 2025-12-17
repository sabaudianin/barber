import { easeInOut, easeOut, Variants } from "framer-motion";

// 1) Delikatne wejście: z mniejszej skali + lekki ruch w górę
export const fadeInScaleUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.22,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: easeOut,
    },
  },
};
export const longFadeInScaleUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.12,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 2.2,
      ease: easeInOut,
    },
  },
};

// 2) Najazd z lewej + rośnięcie do normalnej skali
export const slideInLeftScale: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
    scale: 0.55,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: easeOut,
    },
  },
};

// 3) Najazd z prawej + rośnięcie do normalnej skali
export const slideInRightScale: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
    scale: 0.55,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: easeOut,
    },
  },
};

// 4) Najazd z lewej bez zmiany skali
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: easeInOut,
    },
  },
};

// 5) Najazd z prawej bez zmiany skali
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: easeInOut,
    },
  },
};

// (opcjonalnie) wariant kontenera do staggera
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.2,
    },
  },
};

//lista stagger
export const listItemPop: Variants = {
  hidden: { opacity: 0, x: -18, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOut },
  },
};
