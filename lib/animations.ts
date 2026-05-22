import type { Variants } from "motion/react";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const inViewOnce = {
  once: true,
  amount: 0.2,
};

export function fadeIn(reduced: boolean | null = false, delay = 0): Variants {
  const isReduced = !!reduced;

  return {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: isReduced ? 0.01 : 0.55,
        delay,
        ease: smoothEase,
      },
    },
  };
}

export function fadeUp(reduced: boolean | null = false, distance = 28): Variants {
  const isReduced = !!reduced;

  return {
    hidden: {
      opacity: 0,
      y: isReduced ? 0 : distance,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isReduced ? 0.01 : 0.65,
        ease: smoothEase,
      },
    },
  };
}

export function slideLeft(reduced: boolean | null = false, distance = 44): Variants {
  const isReduced = !!reduced;

  return {
    hidden: {
      opacity: 0,
      x: isReduced ? 0 : distance,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: isReduced ? 0.01 : 0.72,
        ease: smoothEase,
      },
    },
  };
}

export function slideRight(reduced: boolean | null = false, distance = 44): Variants {
  const isReduced = !!reduced;

  return {
    hidden: {
      opacity: 0,
      x: isReduced ? 0 : -distance,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: isReduced ? 0.01 : 0.72,
        ease: smoothEase,
      },
    },
  };
}

export function scaleIn(reduced: boolean | null = false): Variants {
  const isReduced = !!reduced;

  return {
    hidden: {
      opacity: 0,
      scale: isReduced ? 1 : 0.96,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: isReduced ? 0.01 : 0.55,
        ease: smoothEase,
      },
    },
  };
}

export function staggerContainer(reduced: boolean | null = false, stagger = 0.1, delayChildren = 0): Variants {
  const isReduced = !!reduced;

  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isReduced ? 0 : stagger,
        delayChildren,
      },
    },
  };
}
