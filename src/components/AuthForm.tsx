"use client";

import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./ui/card";
import { loginSchema, signUpSchema } from "@/lib/validation/authSchema";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { loginAction, signUpAction } from "@/actions/users";

type Props = {
  type: "login" | "signUp";
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
  email: "",
  password: "",
});

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const validateField = (field: "email" | "password", value: string) => {
  const schema = isLoginForm ? loginSchema : signUpSchema;

  const result = schema.safeParse({
    ...values,
    [field]: value,
  });

  if (!result.success) {
    const fieldError = result.error.issues.find(
      (err) => err.path[0] === field
    );

    setErrors((prev) => ({
      ...prev,
      [field]: fieldError ? fieldError.message : "",
    }));
  } else {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }
};

  const handleSubmit = (formData: FormData) => {
        setErrors({});

        const data = {
      email: formData.get("email") ?? "",
      password: formData.get("password") ?? "",
    };

    const schema = isLoginForm ? loginSchema : signUpSchema;
    const result = schema.safeParse(data);
 

     if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      let errorMessage;
      let title;
      let description;
      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
        title = "Logged in";
        description = "You have been successfully logged in";
      } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
        title = "Signed up";
        description = "Check your email for a confirmation link";
      }

      if (!errorMessage) {
        toast.success(title, { description: description });
        router.replace("/");
      } else {
        console.log("login error is: ", errorMessage);
        toast.error("Error", { description: "errorMessage" });
      }
    });
  };
  return (
    <form
  noValidate
  onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleSubmit(formData);
  }}
>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
            onChange={(e) => {
              setValues((prev) => ({...prev, email: e.target.value }))
            }}
            onBlur={(e)=> validateField("email", e.target.value)}
          />
           {errors.email && (<p className="text-red-400 text-sm">{errors.email}</p>)}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isPending}
            onChange={(e)=> 
              setValues((prev) => ({...prev, password: e.target.value}))}
            onBlur={(e)=> validateField("password", e.target.value)}
          />
          {errors.password && (
        <p className="text-red-400 text-sm">{errors.password}</p>
      )}
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
          {isLoginForm && 
          <p>
          <Link href="/reset-password" className="text-sm underline">
            Forgot password?
          </Link>
        </p>
}
      </CardFooter>
    </form>
  );
}

export default AuthForm;
