import type {Translations} from "@/i18n/constants";

export type ProjectId = keyof Translations["home"]["projects"];

export interface Project {
  /** Key for the project's copy in the translations (`home.projects.<id>`). */
  id: ProjectId;
  name: string;
  /** Leave out for projects that are not public yet; the circle is then not a link. */
  href?: string;
  /** Square image in /public, shown inside the circle. */
  image?: string;
  /** Text inside the circle when there is no image. Defaults to the name's initials. */
  mark?: string;
  /** Language of `mark`, for correct glyphs and pronunciation. */
  markLang?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "circle",
    name: "Circle",
    href: "https://circle.so",
    image: "/projects/circle.png"
  },
  {
    id: "combolab",
    name: "Combolab",
    href: "https://combolab.app",
    image: "/projects/combolab.png"
  },
  {
    id: "tba",
    name: "TBA",
    mark: "極秘",
    markLang: "ja"
  }
];
