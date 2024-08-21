'use client';
import 'regenerator-runtime/runtime';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatAPIMaker } from '@/lib/server/functions/chatapi';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { toast } from 'sonner';
import clsx from 'clsx';

type SpeechSynthesisTypes = {
  speechSynthesis: SpeechSynthesis;
  SpeechSynthesisUtterance: SpeechSynthesisUtterance;
};

const initialMessageHistory = [
  {
    message:
      'Hey there! You can ask me anything about Meer Tarbani. For example: Who is Meer Tarbani?, Skills, Projects, LinkedIn, Mail, etc.',
    sender: 'bot',
  },
];

const useChatAI = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState(initialMessageHistory);
  const [input, setInput] = useState('');
  const submitRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisTypes>();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const handleUtterance = useCallback(
    async (message: string) => {
      if (!window.speechSynthesis || !isDialogOpen) return;
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(message);
      utterThis.voice = synth.getVoices()[6];
      synth.speak(utterThis);
      setUtterance({
        speechSynthesis: synth,
        SpeechSynthesisUtterance: utterThis,
      });
    },
    [isDialogOpen],
  );

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

  useEffect(() => {
    toast.info(listening ? 'Listening...' : 'Stopped listening!');
  }, [listening]);

  useEffect(() => {
    if (transcript && transcript.length > 0 && input !== transcript) {
      setInput(transcript);
    }
  }, [input, transcript]);

  const handleSpeech = () => {
    if (!isDialogOpen) return;
    if (!browserSupportsSpeechRecognition) {
      toast.error('Your browser does not support speech recognition.');
      return;
    }

    if (!isMicrophoneAvailable) {
      toast.error('Microphone is not available.');
      return;
    }

    try {
      listening
        ? SpeechRecognition.stopListening()
        : SpeechRecognition.startListening();
    } catch (error: any) {
      toast.error('An error occurred while trying to listen.', {
        description: error.message,
      });
    }
  };

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

    if (request.status !== 'error' && request.data?.message) {
      await handleUtterance(request.data?.message);
    }

    setMessages(newMessages);
    setInput('');
    setPending(false);
    resetTranscript();
  };

  return {
    submitRef,
    pending,
    messages,
    input,
    setInput,
    bottomRef,
    setShouldScroll,
    handleSpeech,
    handleSubmit,
    listening,
    utterance,
    isDialogOpen,
    setIsDialogOpen,
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
    handleSpeech,
    handleSubmit,
    listening,
    utterance,
    isDialogOpen,
    setIsDialogOpen,
  } = useChatAI();

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) utterance?.speechSynthesis.cancel();
      }}
    >
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
            size="icon"
            variant="ghost"
            className="p-2"
            onClick={handleSpeech}
          >
            <Icons.Mic
              className={clsx('size-5', {
                'animate-pulse text-red-500': listening,
              })}
            />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
