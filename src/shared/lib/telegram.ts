// Best-effort Telegram notification — silently no-ops until TELEGRAM_BOT_TOKEN
// is configured (see the Telegram webhook route for the other half of this).
export async function sendTelegramMessage(chatId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch {
    // Notification failing shouldn't break the recipient's flow — the
    // owner can still see the response in their dashboard.
  }
}
