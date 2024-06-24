import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { convertDateFormat } from "@/lib/date-convertor";
import { deleteMessage } from "@/lib/server/functions/chatform";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type DeleteBtnProps = {
  id: number;
  message: string;
  sender: string;
  createdAt: string;
};

export default function DeleteBtn(props: DeleteBtnProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button size={"icon"} variant={"outline"}>
          <Trash2 className="size-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message!
            <br />
            <p className="flex flex-col gap-2 mt-5">
              <li>Message: {props.message}</li>
              <li>Sender: {props.sender}</li>
              <li>Created At: {convertDateFormat(props.createdAt!)}</li>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await deleteMessage(props.id);
                toast.success("Message deleted successfully");
              } catch (error) {
                console.error(error);
                toast.error("Failed to delete message");
              }
            }}
          >
            <AlertDialogAction
              type="submit"
              className="bg-destructive text-white hover:bg-red-500"
            >
              Continue
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
