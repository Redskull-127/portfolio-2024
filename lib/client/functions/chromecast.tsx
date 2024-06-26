'use client';
import { Button } from '@/components/ui/button';
import { Cast } from 'lucide-react';
import { useCastContext } from '../providers/CastProvider';
import Castjs from '@/lib/cast-min.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export default function ChromeCast() {
  const [dPad, showDPad] = useState(false);
  const [connected, setConnected] = useState(false);
  const { castDetails } = useCastContext();

  const castRef = useRef<any>();
  const Metadata = {
    poster: castDetails.poster,
    description: 'Playing from meertarbani.in',
    title: castDetails.title,
  };

  const handleClick = () => {
    if (typeof window !== undefined) {
      castRef.current = new Castjs();
      if (connected === true) {
        return toast('Already connected to a device!', {
          action: (
            <div
              onClick={(e) => {
                e.preventDefault();
                castRef.current.disconnect();
                setConnected(false);
                showDPad(false);
                toast.dismiss();
                toast.success('Disconnected from device successfully!');
              }}
              className="p-2 border cursor-pointer ml-2"
            >
              Disconnect
            </div>
          ),
        });
      }
      if (castRef.current) {
        castRef.current.cast(castDetails.src, Metadata);
        const connectPromise = () =>
          new Promise((resolve) =>
            castRef.current.on('connect', () => {
              setConnected(true);
              resolve({ name: castRef.current.device });
              toast.success(
                `Connected to ${castRef.current.device} successfully!\n Now Playing ${castDetails.title}!`,
              );
              showDPad(true);
              resolve({ name: castRef.current.device });
            }),
          );

        toast.promise(connectPromise, {
          loading: 'Loading...',
          success: (data: any) => {
            return `${data.name} connected successfully!\n Now Playing ${castDetails.title}!`;
          },
          error: 'Error',
        });

        castRef.current.on('disconnect', () => {
          setConnected(false);
          showDPad(false);
          toast.success('Disconnected from device successfully!');
        });
      }
    }
  };

  return (
    <>
      <Button
        onClick={async (e) => {
          try {
            handleClick();
          } catch (error) {
            console.error(error);
          }
        }}
        variant={'default'}
        size={'icon'}
      >
        <Cast className="h-5 w-5" />
      </Button>
      {dPad && <ShowControls />}
    </>
  );
}

export const ShowControls = () => {
  const [shouldOpen, setShouldOpen] = useState(false);
  return (
    <Dialog
      onOpenChange={() => {
        if (shouldOpen) {
          setShouldOpen(false);
        }
      }}
      defaultOpen={shouldOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function test() {
  const casttest = new Castjs();
  casttest._isConnectedChanged();
}
