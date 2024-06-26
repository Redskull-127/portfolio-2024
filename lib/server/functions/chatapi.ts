export type ChatAPIType = {
  message: string;
  status: 'success' | 'error';
  data?: ChatAPIResponse;
};

type ChatAPIResponse = {
  message: string;
  status: number;
};

export async function ChatAPIMaker(message: string): Promise<ChatAPIType> {
  try {
    const res = await fetch(
      process.env['NEXT_PUBLIC_AI_CHATBOT_URL'] as string,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify({ message: message }),
      },
    );
    const data = (await res.json()) as ChatAPIResponse;
    return { status: 'success', message: 'Chat API Success', data: data };
  } catch (err) {
    console.log(err);
    return { status: 'error', message: 'Something went wrong' };
  }
}
