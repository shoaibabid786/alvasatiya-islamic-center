export async function sendInboxFromBrowser(input: {
  inbox: string;
  title: string;
  fields: Record<string, string>;
  replyTo?: string;
}) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(input.inbox)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: input.title,
      _template: "box",
      _captcha: "false",
      ...(input.replyTo ? { _replyto: input.replyTo } : {}),
      ...input.fields,
    }),
  });
  const data = (await response.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  const message = data.message || "";
  if (/activat/i.test(message)) return;
  if (!response.ok || data.success === "false" || data.success === false) {
    throw new Error(message || "Could not send your message. Please email alvasatiya4@gmail.com.");
  }
}
