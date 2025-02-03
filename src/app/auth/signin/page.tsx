import { signIn } from "@/auth";
import RedirectIfLoggedIn from "@/app/auth/logged-in";

const SignInPage = () => {
  return (
    <RedirectIfLoggedIn>
      <div className="flex justify-center items-center h-screen">
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign in with Google
          </button>
        </form>
      </div>
    </RedirectIfLoggedIn>
  );
};

export default SignInPage;
