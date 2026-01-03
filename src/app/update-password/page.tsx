"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { updatePasswordSchema } from "@/lib/validation/authSchema";
import { createClient } from "@/auth/client";


export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

    // STEP 1 — restore session from the URL
  useEffect(() => {
    async function run() {
      await supabase.auth.exchangeCodeForSession(window.location.href);
    }

    run();
  }, [supabase]);

  const handleSubmit = (formData: FormData) => {
    setErrors({});
    setSuccess(null);

  const result = updatePasswordSchema.safeParse({
      password,
      confirm,
    });

  if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) 
        setErrors({password: error.message});
      

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

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}
        >
          <CardContent className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>New password</Label>
              <Input
                type="password"
                value={password}
                disabled={isPending}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Confirm password</Label>
              <Input
                type="password"
                value={confirm}
                disabled={isPending}
                onChange={(e) => setConfirm(e.target.value)}
              />
               {errors.confirm && (
                <p className="text-sm text-red-400">{errors.confirm}</p>
              )}
            </div>

            {success && (<p className="text-sm text-green-600">{success}</p>)}
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
