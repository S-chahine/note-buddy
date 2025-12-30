import Link from 'next/link'
import Image from 'next/image'
import { shadow } from '@/styles/utils'
import { Button } from './ui/button';
import DarkModeToggle from './DarkModeToggle';
import LogOutButton from './LogOutButton';
import { getUser } from '@/auth/server';
import { SidebarTrigger } from './ui/sidebar';

async function Header() {
    const user = await getUser();

  return (
    <header className="relative flex h-24 w-full justify-between items-center px-3 sm:px-8" 
    style={{
        boxShadow: shadow,
    }}>
        <SidebarTrigger className="absolute left-1 top-1" />
        <Link href="/" className="flex gap-2 items-end" >
        <Image src="/NoteBuddy.png" height={60} width={60} alt={'logo'} priority/>
        <h1 className="flex flex-col text-secondary-foreground dark:text-secondary text-2xl font-semibold leading-6 pb-1">
            Note <span>Buddy</span>
        </h1>
        </Link>

        <div className='flex gap-4'> 
        {user ? ( 
            <LogOutButton />
        ) : (
            <>
            <Button asChild className="hidden sm:block">
                <Link href="/sign-up" >
                Sign Up
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/login">
                Login
                </Link>
            </Button>
            </>
         )}
         <DarkModeToggle />
        </div>
    </header>
  )
}

export default Header