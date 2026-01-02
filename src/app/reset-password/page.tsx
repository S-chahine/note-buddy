"use client";

import { useState, useTransition } from "react";
import { sendResetPasswordEmailAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await sendResetPasswordEmailAction(email);

      if (res.errorMessage) {
        setMessage(res.errorMessage);
      } else {
        setMessage("Check your email for a reset link.");
      }
    });
  };

  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="bg-accent w-full max-w-md pb-10">
        <form onSubmit={handleSubmit}>
          <CardHeader className="mb-4">
            <CardTitle className="text-center text-3xl">
              Forgot Password
            </CardTitle>
          </CardHeader>
          <CardContent className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Reset Password</Label>

              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-4 flex flex-col gap-6">
            <Button className="w-full mt-6">Send reset email</Button>
            {message && (
              <p className="text-muted-foreground text-center text-sm">
                {message}
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
