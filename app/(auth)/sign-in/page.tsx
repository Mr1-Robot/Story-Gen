import Link from "next/link";
import SignInForm from "../_components/sign-in-form";
import ModeToggle from "@/components/mode-toggle";

export default function SignIn() {
  return (
    <section className="min-w-96 space-y-4 rounded-sm bg-primary-foreground p-6 shadow-md">
      <header className="flex items-start justify-between gap-10">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Welcome back to Story Gen.</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Sign in to continue crafting your next great story!
          </p>
        </div>
        <ModeToggle />
      </header>
      <SignInForm />
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Do not have an account?{" "}
        <Link href="/sign-up" className="text-slate-900 dark:text-white">
          Sign Up
        </Link>
      </p>
    </section>
  );
}
