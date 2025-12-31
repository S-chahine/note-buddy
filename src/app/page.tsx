import { getUser } from '@/auth/server';
import AskAIButton from '@/components/AskAIButton';
import NewNoteButton from '@/components/NewNoteButton';
import NoteTextInput from '@/components/NoteTextInput';
import { prisma } from '@/db/prisma';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();

  const noteId = Array.isArray(noteIdParam) 
    ? noteIdParam![0] 
    : noteIdParam || "";

   const note = await prisma.note.findFirst({
      where: { id: noteId, authorId: user?.id },
    });

      if (!user) {
      return (
    <div className="flex h-full flex-col items-center gap-6 ">
      <h1 className="text-3xl font-bold">Welcome to NoteBuddy ✨</h1>
       <p className="text-muted-foreground">
          Organize your thoughts, save notes, and get AI help — all in one place.
        </p>
    <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""}/>
      <div className="flex w-full max-w-4xl justify-end gap-4 mb-6">
      <AskAIButton user={user} />
      <NewNoteButton user={user}/>
    </div>
      </div>
  ) 
  }

 
    return (
    <div className="flex h-full flex-col items-center gap-6 ">
    <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""}/>
      <div className="flex w-full max-w-4xl justify-end gap-4 mb-6">
      <AskAIButton user={user} />
      <NewNoteButton user={user}/>
    </div>
      </div>
  )
}

export default HomePage