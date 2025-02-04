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
    <header className="flex sticky top-0 z-40 bg-white justify-between gap-4 items-center mb-8 px-10 py-4">
      <Link href="/">
        <Image
          src="/broas-logo.svg"
          alt="Broas Logo"
          width={100}
          height={30}
          className="w-20 h-auto"
        />
      </Link>
      <p className="text-gray-400">encontre aqui as melhores broas</p>
      <span className="flex gap-4 items-center">
        {user ? (
          <EditPostDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
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
