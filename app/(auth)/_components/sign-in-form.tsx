"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/lib/validations";
import { Loader } from "lucide-react";
import { signIn } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = async (values: z.infer<typeof signInSchema>) => {
    try {
      const { email, password } = values;

      const res = await signIn({ email, password });

      if (res) {
        const type = res.status === 400 ? "error" : "success";
        // Render a toast.
        toast[type](res.message, {
          action: {
            label: "Close",
            onClick: () => {},
          },
        });

        if (res.status === 400) return;
      }

      // Reset.
      form.reset();

      // Naviagte to home.
      router.replace("/");
    } catch (err) {
      console.log(err);
    }
  };

  // Check weather the form is submitting or not.
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g muaamar@mail.com"
                  {...field}
                  className="placeholder:text-sm"
                />
              </FormControl>
              <FormDescription className="sr-only">
                This is your email we gonna use.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="placeholder:text-sm"
                />
              </FormControl>
              <FormDescription className="sr-only">
                Your password goes here.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-1/3 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
