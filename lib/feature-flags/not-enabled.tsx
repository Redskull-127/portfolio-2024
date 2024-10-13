import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function FeatureNotEnabled() {
  const router = useRouter();
  return (
    <main className="w-full h-screen bg-primary-foreground flex flex-col items-center justify-center">
      <h1>This feature is not avaliable for you. yet!</h1>
      <p>Stay tuned for updates.</p>
      <Button
        onClick={() => {
          router.push('/');
        }}
        className="mt-5"
      >
        Home
      </Button>
    </main>
  );
}
