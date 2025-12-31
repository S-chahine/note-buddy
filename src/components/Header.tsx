import Link from "next/link";
import Image from "next/image";
import { shadow } from "@/styles/utils";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/auth/server";
import { SidebarTrigger } from "./ui/sidebar";
import { Menu } from "lucide-react";

async function Header() {
  const user = await getUser();

  return (
    <header
      className="relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      {/* Desktop sidebar trigger */}
      <SidebarTrigger className="absolute top-1 left-1 hidden sm:block" />
      <Link href="/" className="flex items-end gap-2">
        <Image
          src="/NoteBuddy.png"
          height={60}
          width={60}
          alt={"logo"}
          priority
        />
        <h1 className="text-secondary-foreground dark:text-secondary flex flex-col pb-1 text-2xl leading-6 font-semibold">
          Note <span>Buddy</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {/* Mobile burger menu */}
        <SidebarTrigger asChild className="sm:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SidebarTrigger>
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild className="hidden sm:block">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
