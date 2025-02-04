import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import HeaderUser from "./header-user";
import EditPostDialog from "../app/post/edit-post-dialog";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

const Header = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="flex sticky top-0 z-40 bg-white justify-between gap-4 items-center px-6 py-2  sm:px-10 sm:py-4">
      <Link href="/">
        <Image
          src="/broas-logo.svg"
          alt="Broas Logo"
          width={100}
          height={30}
          className="w-14 sm:w-20 h-auto"
        />
      </Link>
      <p className="text-gray-400 max-sm:hidden">
        encontre aqui as melhores broas
      </p>
      <span className="flex gap-4 items-center">
        {user ? (
          <EditPostDialog>
            <Button>
              <PlusCircle className="size-2 sm:size-4" />
              Postar
            </Button>
          </EditPostDialog>
        ) : null}
        <HeaderUser session={session} />
      </span>
    </header>
  );
};

export default Header;
