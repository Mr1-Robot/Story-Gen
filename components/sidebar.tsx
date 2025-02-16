"use client";

import Link from "next/link";
import { SidebarLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "@/lib/actions";
import { toast } from "sonner";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Active route handler.
  const activeRoute = (route: string) => {
    return pathname === route;
  };

  const signOutHandler = async () => {
    try {
      await signOut();

      toast.success("Signed out successfully.", {
        action: {
          label: "Close",
          onClick: () => {},
        },
      });

      router.replace("/sign-in");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <aside className="fixed inset-0 flex h-screen w-full max-w-64 flex-col justify-between gap-14 border-r bg-primary-foreground p-4">
      <h1 className="mt-4 text-2xl font-bold">Story Gen.</h1>

      <nav className="w-full flex-grow space-y-1">
        {SidebarLinks.map((item) => (
          <Link
            key={item.id}
            href={item.route}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-md bg-primary-foreground p-2 px-3 text-sm font-medium text-black/80 dark:text-white/90",
              activeRoute(item.route) && "bg-primary text-white",
              item.route === "/" &&
                pathname.startsWith("/stories") &&
                "bg-primary text-white",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>

      <div>
        <Button
          onClick={signOutHandler}
          variant="ghost"
          className="flex w-full cursor-pointer items-center gap-2 text-red-400 transition-colors hover:bg-transparent hover:text-red-300"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
