export const DRIVE_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbww8nee3wr55UDc713aeAWuHaoE6kHyHKjvWSOLTBFpvbYKphk4gELhqWdqX3hk9Ytpvw/exec";

export type StoryUpload = {
  sessionId: string;
  characterName: string;
  pdfBase64: string;
  background: string;
  skinTone: string;
  dress: string;
  story: string;
};

export async function sendStory(payload: StoryUpload) {
  await fetch(DRIVE_WEBHOOK, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
  });
}