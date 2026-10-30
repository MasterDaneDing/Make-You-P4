const KEY = "make-you-drive-webhook";

export const MAKE_YOU_FOLDER_ID = "1NJUZnlnuQ3vux_8I6AraOIE2IsTjVqLg";

export const DRIVE_SCRIPT = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var folder = DriveApp.getFolderById("${MAKE_YOU_FOLDER_ID}");
  var bytes = Utilities.base64Decode(data.pdfBase64);
  var blob = Utilities.newBlob(bytes, "application/pdf", data.filename || "Story.pdf");
  var file = folder.createFile(blob);
  return ContentService.createTextOutput(JSON.stringify({ status: "ok", url: file.getUrl() }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

export function loadWebhook() {
  try {
    return localStorage.getItem(KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function saveWebhook(url: string) {
  const next = url.trim();
  try {
    if (next) localStorage.setItem(KEY, next);
    else localStorage.removeItem(KEY);
  } catch {
    /* private mode */
  }
  return next;
}

export async function sendStoryPdf(webhook: string, filename: string, pdfBase64: string, studentName: string) {
  await fetch(webhook, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, pdfBase64, studentName }),
  });
}
