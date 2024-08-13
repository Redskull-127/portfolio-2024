'use server';

export type ChatAPIType = {
  message: string;
  status: 'success' | 'error';
  data?: ChatAPIResponse;
};

type ChatAPIResponse = {
  message: string;
  status: number;
};

const API_URL = process.env['NEXT_PUBLIC_AI_CHATBOT_URL'];
export async function ChatAPIMaker(message: string): Promise<ChatAPIType> {
  try {
    const res = await fetch(`${API_URL}?message=${message}`, {
      method: 'GET',
    });
    const data = (await res.json())[0] as ChatAPIResponse;
    return { status: 'success', message: 'Chat API Success', data: data };
  } catch (err) {
    console.log(err);
    return { status: 'error', message: 'Something went wrong' };
  }
}
