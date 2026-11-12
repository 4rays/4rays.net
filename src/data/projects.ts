export interface Project {
  name: string;
  href: string;
  /** Square image in /public, shown inside the circle. Falls back to a monogram. */
  image?: string;
  tagline?: string;
}

// TODO: replace placeholders with the real links and images.
export const PROJECTS: Project[] = [
  { name: "Combolab", href: "#", image: "/combolab.png", tagline: "Placeholder tagline" },
  { name: "Project Two", href: "#", tagline: "Placeholder tagline" },
  { name: "Project Three", href: "#", tagline: "Placeholder tagline" },
];
