import type { Look } from "@/lib/dress/types";

export const PLACES = ["park", "classroom", "toilet", "moon", "zoo", "aquarium"] as const;
export type Place = (typeof PLACES)[number];

export const ACTIONS = ["jumping", "running", "singing", "dancing"] as const;
export type Action = (typeof ACTIONS)[number];

export const HURTS = ["arm", "leg", "foot", "hand", "nose", "pat-pat", "brain", "tongue"] as const;
export type Hurt = (typeof HURTS)[number];

export const HELPERS = ["phonics", "vegetable", "violin", "mrv", "paige", "cobra", "vuggoo"] as const;
export type HelperId = (typeof HELPERS)[number];

export const PAGE_COUNT = 9;

export type Tale = {
  me: Look;
  classmate: Look;
  place: Place | null;
  day: string;
  action: Action;
  sudden: "Suddenly" | "All of a sudden";
  hurt: Hurt;
  helper: HelperId;
  guest: HelperId;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const PLACE_LABEL: Record<Place, string> = {
  park: "park",
  classroom: "classroom",
  toilet: "toilet",
  moon: "moon",
  zoo: "zoo",
  aquarium: "aquarium",
};

export const HELPER_LABEL: Record<HelperId, string> = {
  phonics: "Phonics Man",
  vegetable: "Mr. Vegetable",
  violin: "Mr. Violin",
  mrv: "Mr. V",
  paige: "Royal Paige",
  cobra: "Black Cobra",
  vuggoo: "Lord Vuggoo",
};

export const HELPER_SRC: Record<HelperId, string> = {
  phonics: "/story/phonics-man.png",
  vegetable: "/story/mr-vegetable.png",
  violin: "/story/mr-violin.png",
  mrv: "/story/mr-v.png",
  paige: "/story/royal-paige.png",
  cobra: "/story/black-cobra.png",
  vuggoo: "/story/lord-vuggoo.png",
};

export const FUNG_SRC = "/story/fung-fung.png";
export const SONG_SRC = "/story/going-out.mp3";

const ACTION_LINE: Record<Action, string> = {
  jumping: "jumping",
  running: "running too fast",
  singing: "singing loudly",
  dancing: "dancing",
};

const ACTION_LESSON: Record<Action, string> = {
  jumping: "jump like that",
  running: "run too fast",
  singing: "sing so loudly",
  dancing: "dance like that",
};

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)]!;
}

export function called(look: Look, fallback: string) {
  const name = look.name.trim();
  return name || fallback;
}

export function makeTale(me: Look, classmate: Look): Tale {
  const helper = pick(HELPERS);
  const guest = pick(HELPERS.filter((id) => id !== helper));
  return {
    me,
    classmate,
    place: null,
    day: pick(DAYS),
    action: pick(ACTIONS),
    sudden: pick(["Suddenly", "All of a sudden"] as const),
    hurt: pick(HURTS),
    helper,
    guest,
  };
}

export function sentence(tale: Tale, page: number) {
  const me = called(tale.me, "Me");
  const pal = called(tale.classmate, "my classmate");
  const where = tale.place ? `the ${PLACE_LABEL[tale.place]}` : "the ______";
  if (page === 0) {
    return `Hello! I am ${me} and this is my classmate, ${pal}. I want to tell you about the accident in ${where}.`;
  }
  if (page === 1) {
    return `${me} and ${pal} went to ${where} last ${tale.day}.`;
  }
  if (page === 2) {
    return `${pal} was ${ACTION_LINE[tale.action]}.`;
  }
  if (page === 3) {
    return `${tale.sudden} ${pal} fell down. "Ouch! I can't move my ${tale.hurt}!" shouted ${pal}.`;
  }
  if (page === 4) {
    return `Fung Fung laughed at ${pal}. "We shouldn't laugh at others!" I shouted.`;
  }
  if (page === 5) {
    return `I called for help! Luckily, ${HELPER_LABEL[tale.helper]} came to help!`;
  }
  if (page === 6) {
    return `${pal} felt afraid because their ${tale.hurt} couldn't move.`;
  }
  if (page === 7) {
    return `${pal} learnt that we should be careful and not ${ACTION_LESSON[tale.action]}.`;
  }
  return "Let's be careful next time!";
}
