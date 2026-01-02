"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState, useTransition } from "react";
import { Textarea } from "./ui/textarea";
import { ArrowUpIcon } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { askAIAboutNotesAction } from "@/actions/notes";
import "@/styles/ai-response.css";

type Props = {
  user: User | null;
};
function AskAIButton({ user }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleClickInput = () => {
    textareaRef.current?.focus();
  };
  const handleSubmit = () => {
    if (!questionText.trim()) return;

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);

    setQuestionText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(newQuestions, responses);
      setResponses((prev) => [...prev, response]);

      setTimeout(scrollToBottom, 100);
    });
  };
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      contentRef.current?.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <Button variant="secondary">Ask AI</Button>
        </DialogTrigger>
        <DialogContent
          className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col"
          ref={contentRef}
        >
          <DialogHeader>
            <DialogTitle>Ask AI About Your Notes</DialogTitle>
            <DialogDescription>
              Our AI can answer questions about all your notes
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-1 flex-col gap-8 overflow-auto">
            {questions.map((question, index) => (
              <Fragment key={index}>
                <div className="bg-muted text-muted-foreground mt-auto max-w-[60%] rounded-md px-2 py-1 text-sm">
                  {question}
                </div>
                <div>
                  {responses[index] && (
                    <p
  className="bot-response text-muted-foreground text-sm"
  dangerouslySetInnerHTML={{
    __html: sanitizeHtml(responses[index], {
      allowedTags: [
        "b",
        "i",
        "em",
        "strong",
        "u",
        "p",
        "br",
        "ul",
        "ol",
        "li",
        "code",
        "pre",
        "span"
      ],
      allowedAttributes: {
        span: ["class"],
        code: ["class"]
      },
      disallowedTagsMode: "discard"
    }),
  }}
/>
                  )}
                </div>
              </Fragment>
            ))}
            {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
          </div>
          <div
            className="flex cursor-text flex-col rounded-lg border p-4"
            onClick={handleClickInput}
          >
            <Textarea
              ref={textareaRef}
              placeholder="Ask me anything about your notes..."
              value={questionText}
              className="placeholder:text-muted-foreground resize-none rounded-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{
                minHeight: "0",
                lineHeight: "normal",
              }}
              rows={1}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <Button
              className="ml-auto size-8 rounded-full"
              type="submit"
              disabled={isPending}
            >
              <ArrowUpIcon className="text-background" />
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AskAIButton;
