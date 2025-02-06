import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { links } from "@/lib/links";

type Props = {
  children: React.ReactNode;
  redirectPath?: string;
};

const RedirectIfLoggedIn = async ({
  children,
  redirectPath = links.home.href,
}: Props) => {
  const session = await auth();

  if (session?.user) {
    redirect(redirectPath);
  }

  return <>{children}</>;
};

export default RedirectIfLoggedIn;
