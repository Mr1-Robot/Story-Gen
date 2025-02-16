import Link from "next/link";
import SignUpForm from "../_components/sign-up-form";
import ModeToggle from "@/components/mode-toggle";

export default function SignUp() {
  return (
    <section className="min-w-96 space-y-4 rounded-sm bg-primary-foreground p-6 shadow-md">
      <header className="flex items-start justify-between gap-10">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Join Story Gen. Now</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Unleash Your Imagination—Create Unique Stories in Seconds!
          </p>
        </div>
        <ModeToggle />
      </header>
      <SignUpForm />
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-slate-900 dark:text-white">
          Sign In
        </Link>
      </p>
    </section>
  );
}
