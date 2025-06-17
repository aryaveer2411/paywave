import axios from 'axios';

export const sendWebhook = async (url: string, data: any) => {
  try {
    await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook failed:', err.message);
    } else {
      console.error('Webhook failed:', err);
    }
  }
};
