type ClassValue = string | number | null | false | undefined;

/**
 * Concatène des classes Tailwind en ignorant les valeurs falsy.
 * Version légère (sans clsx/tailwind-merge) suffisante pour nos besoins.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
