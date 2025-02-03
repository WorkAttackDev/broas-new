import { signIn } from "@/auth";
import RedirectIfLoggedIn from "@/app/auth/logged-in";

export default function SignUpPage() {
  return (
    <RedirectIfLoggedIn>
      <div className="flex justify-center items-center h-screen">
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Sign up with Google
          </button>
        </form>
      </div>
    </RedirectIfLoggedIn>
  );
}
