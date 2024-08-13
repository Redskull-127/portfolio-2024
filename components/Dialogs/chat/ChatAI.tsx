'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../../icons/icons';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChatAPIMaker } from '@/lib/server/functions/chatapi';
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from 'react-speech-recognition';
import { toast } from 'sonner';

const initialMessageHistory = [
  {
    message:
      'Hey there! You can ask me anything about Meer Tarbani. For example: Who is Meer Tarbani?, Skills, Projects, LinkedIn, Mail, etc.',
    sender: 'bot',
  },
];

const useChatAI = () => {
  const submitRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState(initialMessageHistory);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  // const {
  //   isMicrophoneAvailable,
  //   listening,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition,
  //   transcript,
  //   finalTranscript,
  // } = useSpeechRecognition();

  useEffect(() => {
    if (shouldScroll && bottomRef.current) {
      const timer = setTimeout(() => bottomRef.current?.scrollIntoView(), 500);
      return () => clearTimeout(timer);
    }
  }, [shouldScroll, messages]);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitRef.current?.click();
      }
    };
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, []);

  // useEffect(() => {
  //   if (finalTranscript.length > 0) {
  //     setInput(finalTranscript);
  //   }
  //   if (finalTranscript === input) resetTranscript();
  // }, [input, finalTranscript, resetTranscript]);

  // const handleSpeech = useMemo(
  //   () => async () => {
  //     if (!isMicrophoneAvailable) {
  //       return toast.warning('Microphone is not available');
  //     }
  //     if (!browserSupportsSpeechRecognition) {
  //       return toast.warning(
  //         'Your browser does not support speech recognition',
  //       );
  //     }
  //     try {
  //       if (!listening) {
  //         await SpeechRecognition.startListening();
  //         toast.info('Listening...');
  //       } else {
  //         await SpeechRecognition.stopListening();
  //         toast.info('Stopped listening');
  //       }
  //     } catch (err: any) {
  //       toast.error(err);
  //     }
  //   },
  //   [isMicrophoneAvailable, browserSupportsSpeechRecognition, listening],
  // );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const request = await ChatAPIMaker(input);
    const newMessages = [
      ...messages,
      { message: input, sender: 'user' },
      request.status === 'error'
        ? { message: 'Something went wrong, Please try again.', sender: 'bot' }
        : { message: request.data?.message || 'Please re-try', sender: 'bot' },
    ];

    setMessages(newMessages);
    setInput('');
    setPending(false);
  };

  return {
    submitRef,
    pending,
    messages,
    input,
    setInput,
    bottomRef,
    setShouldScroll,
    // handleSpeech,
    handleSubmit,
  };
};

export default function ChatAI() {
  const {
    submitRef,
    pending,
    messages,
    input,
    setInput,
    bottomRef,
    setShouldScroll,
    // handleSpeech,
    handleSubmit,
  } = useChatAI();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          id="chat-with-ai"
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Chat with AI!
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat with AI</DialogTitle>
          <DialogDescription>
            This chatbot is trained on meta/llama-3-8b-instruct LLM to chat with
            you.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          onLoad={() => setShouldScroll(true)}
          className="flex flex-col min-h-[30vh] max-h-[50vh] w-full"
        >
          {messages.map((data, index) => (
            <div
              key={index}
              className={`flex h-fit w-full justify-${data.sender === 'bot' ? 'start' : 'end'} items-start gap-3 my-3`}
            >
              {data.sender === 'bot' && (
                <Icons.Bot className="h-5 max-w-5 my-3" />
              )}
              <h1 className="text-md p-3 border rounded-md max-w-96">
                {data.message}
              </h1>
              {data.sender === 'user' && (
                <Icons.User className="h-5 w-5 my-3" />
              )}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className="w-full flex items-center gap-2"
        >
          <Textarea
            rows={1}
            cols={1}
            placeholder="Type your message here."
            name="message-input"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            ref={submitRef}
            type="submit"
            disabled={pending}
            className="disabled:opacity-60"
          >
            {pending ? (
              <div className="animate-spin w-5 h-5 border-2 border-gray-700 rounded-full"></div>
            ) : (
              'Send'
            )}
          </Button>
          <Button
            type="button"
            disabled
            size="icon"
            variant="ghost"
            className="p-2"
            // onClick={handleSpeech}
          >
            <Icons.Mic className="size-5" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
