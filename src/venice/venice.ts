import axios from 'axios';

const VENICE_URL = 'https://api.venice.ai/api/v1/chat/completions';

export async function complete(prompt: string): Promise<string> {
  const { data } = await axios.post(
    VENICE_URL,
    {
      model: 'llama-3.3-70b',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VENICE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return data.choices[0].message.content as string;
}
