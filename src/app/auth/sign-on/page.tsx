import { signIn } from "@/auth";
import RedirectIfLoggedIn from "@/app/auth/logged-in";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SignOnPage = () => {
  return (
    <RedirectIfLoggedIn>
      <main className="flex px-6 py-2 sm:px-10 sm:py-4 justify-center items-center h-[80vh]">
        <section className="flex flex-col gap-10 items-center py-10 bg-white rounded-xl shadow-md w-full max-w-md">
          <Image
            src="/broas-logo.svg"
            alt="Broas Logo"
            width={120}
            height={60}
            className="w-20 sm:w-32 h-auto"
          />
          <h1 className="text-xl text-secondary-foreground p-2 font-semibold text-center bg-muted w-full">
            Entrar no Broas
          </h1>
          <p className="text-sm text-center w-[90%] text-muted-foreground">
            Entre na sua conta para fazer parte da experiencia
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button>Entrar com Google</Button>
          </form>
        </section>
      </main>
    </RedirectIfLoggedIn>
  );
};

export default SignOnPage;
