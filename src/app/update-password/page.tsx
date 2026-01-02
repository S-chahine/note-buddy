"use client";

import { useState, useTransition } from "react";
import { updatePasswordAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    startTransition(async () => {
      const { errorMessage } = await updatePasswordAction(password);

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      setSuccess("Password updated successfully. Redirecting…");

      setTimeout(() => router.push("/login"), 1500);
    });
  };

  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="bg-accent w-full max-w-md pb-10">
        <CardHeader className="mb-4">
          <CardTitle className="text-center text-3xl">
            Reset your password
            </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>New password</Label>
              <Input
                type="password"
                value={password}
                disabled={isPending}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Confirm password</Label>
              <Input
                type="password"
                value={confirm}
                disabled={isPending}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
          </CardContent>

          <CardFooter>
            <Button className="w-full mt-6" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
