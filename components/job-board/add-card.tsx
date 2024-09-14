import { Button } from '../ui/button';
import { addJob } from '@/lib/server/functions/job-board';

export default function AddCard() {
  return (
    <form action={addJob}>
      <Button
        type="submit"
        className="flex items-center justify-center h-fit bg-white border border-gray-300 rounded-md cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </Button>
    </form>
  );
}
