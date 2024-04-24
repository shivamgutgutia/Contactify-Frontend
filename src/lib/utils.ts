import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validate(map: string[], active: boolean[]) {
  const uniqueSet = new Set();

  for (let i = 0; i < map.length; i++) {
    if (!active[i]) continue;
    if (map[i] !== undefined) {
      if (map[i] === "Phone Number" || map[i] === "E-Mail") continue;
      if (uniqueSet.has(map[i])) {
        // Duplicate found
        return true;
      } else {
        uniqueSet.add(map[i]);
      }
    }
  }

  return false;
}
