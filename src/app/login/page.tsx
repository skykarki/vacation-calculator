import { LoginForm } from "@/components/LoginForm";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { googleEnabled } from "@/lib/auth.config";

export default function LoginPage() {

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <LoginForm />
      <GoogleSignInButton enabled={googleEnabled} />
    </main>
  );
}
