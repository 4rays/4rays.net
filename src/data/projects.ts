export interface Project {
  name: string;
  /** Leave out for projects that are not public yet; the circle is then not a link. */
  href?: string;
  /** Square image in /public, shown inside the circle. */
  image?: string;
  /** Text inside the circle when there is no image. Defaults to the name's initials. */
  mark?: string;
  /** Language of `mark`, for correct glyphs and pronunciation. */
  markLang?: string;
  tagline?: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Circle",
    href: "https://circle.so",
    image: "/projects/circle.png",
    tagline: "iOS Contractor",
  },
  {
    name: "Combolab",
    href: "https://combolab.app",
    image: "/projects/combolab.png",
    tagline: "Creator",
  },
  {
    name: "TBA",
    mark: "極秘",
    markLang: "ja",
    tagline: "Coming soon",
  },
];
