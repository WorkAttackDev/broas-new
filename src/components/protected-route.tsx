import { auth } from "@/auth";
import { redirect } from "next/navigation";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = async ({ children }) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
