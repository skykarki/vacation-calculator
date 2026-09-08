import { SignupForm } from "@/components/SignupForm";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { googleEnabled } from "@/lib/auth.config";

export default function SignupPage() {

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
      <SignupForm />
      <GoogleSignInButton enabled={googleEnabled} />
    </main>
  );
}
