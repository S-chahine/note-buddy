"use client";

import useNote from "@/hooks/useNote";
import { Note } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";

type Props = {
  note: Note;
};

function SelectNoteButton({ note }: Props) {
  const noteId = useSearchParams().get("noteId") || "";

  const { noteText: selectedNoteText } = useNote();
  const [shouldUseBeGlobalNoteText, setShouldUseGlobalNoteText] =
    useState(false);
  const [localNoteText, setLocalNoteText] = useState(note.text);

  useEffect(() => {
    if (noteId === note.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldUseGlobalNoteText(true);
    } else {
      setShouldUseGlobalNoteText(false);
    }
  }, [noteId, note.id]);

  useEffect(() => {
    if (shouldUseBeGlobalNoteText) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalNoteText(selectedNoteText);
    }
  }, [selectedNoteText, shouldUseBeGlobalNoteText]);

  const blankNoteText = "EMPTY NOTE";
  let noteText = localNoteText || blankNoteText;

  if (shouldUseBeGlobalNoteText) {
    noteText = selectedNoteText || blankNoteText;
  }
  return (
    <SidebarMenuButton
      asChild
      className={`items-start gap-0 pr-12 ${
        note.id === noteId && "bg-sidebar-accent/50"
      }`}
    >
      <Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
        <p className="w-full truncate overflow-hidden text-ellipsis whitespace-nowrap">
          {noteText}
        </p>
        <p className="text-muted-foreground text-xs">
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(note.updatedAt))}
        </p>
      </Link>
    </SidebarMenuButton>
  );
}

export default SelectNoteButton;
