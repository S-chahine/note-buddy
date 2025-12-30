"use client";
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
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { start } from "repl";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { error } from "console";
import { deleteNoteAction } from "@/actions/notes";

type Props = {
  noteId: string;
  deleteNoteLocally: (noteId: string) => void;
};

function DeleteNoteButton({ noteId, deleteNoteLocally }: Props) {

  const router = useRouter();
  const noteIdParam = useSearchParams().get("noteId") || ""

  const [isPending, startTransition ] = useTransition();

  const handleDeleteNote = () => {
    startTransition (async () => {
      const {errorMessage} = await deleteNoteAction(noteId);
      
      if(!errorMessage) {
        toast.success("Note Deleted", {
          description: "You have successfully deleted the note"
        })
        deleteNoteLocally(noteId);

        if(noteId === noteIdParam) {
          router.replace("/")
        }
        router.refresh();
      } else {
        toast.error("Error",
          {description: errorMessage}
        )
      }
    })
    }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="opcaity-0 group-hover/item:opacity-100 absolute top-0.5 right-2 size-7 -translate-y-0.5 p-0 [&_svg]:size-3"
        variant="ghost">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-accent!">
        <AlertDialogHeader >
          <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your note from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteNote}
            className="w-24 bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isPending? <Loader2 className="animate-spin"/> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteNoteButton;
