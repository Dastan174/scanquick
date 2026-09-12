interface InlineKeyboardButton {
  text: string;
  url: string;
}

// Best-effort Telegram notification — silently no-ops until TELEGRAM_BOT_TOKEN
// is configured (see the Telegram webhook route for the other half of this).
// `buttons` renders as a single row of URL buttons under the message — used
// to hand the owner a way back to the site instead of leaving them in Telegram.
export async function sendTelegramMessage(
  chatId: string,
  text: string,
  buttons?: InlineKeyboardButton[],
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        ...(buttons?.length
          ? {
              reply_markup: {
                inline_keyboard: [buttons.map((b) => ({ text: b.text, url: b.url }))],
              },
            }
          : {}),
      }),
    });
  } catch {
    // Notification failing shouldn't break the recipient's flow — the
    // owner can still see the response in their dashboard.
  }
}
