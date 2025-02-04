"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { links } from "@/utils/links";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  session: Session | null;
};

const HeaderUser = ({ session }: Props) => {
  return (
    <div>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full overflow-hidden w-10 h-10 border-2 border-gray-200 cursor-pointer hover:border-primary ease-out duration-200 data-[state=open]:border-primary">
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={session.user?.image || "/imgs/gradient.svg"}
                alt="User Avatar"
              />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="absolute right-0 mt-2 w-max bg-white rounded-md shadow-xl z-10"
          >
            <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={links.profile.href}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => signOut()}>
              Terminar sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <span className="flex gap-2">
          <Link
            href={links.signin.href}
            className={buttonVariants({ variant: "default" })}
          >
            Entrar
          </Link>
          <Link
            href={links.signup.href}
            className={buttonVariants({ variant: "default" })}
          >
            Criar Conta
          </Link>
        </span>
      )}
    </div>
  );
};

export default HeaderUser;
