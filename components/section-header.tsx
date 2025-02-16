import React from "react";
import ModeToggle from "./mode-toggle";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

export default function SectionHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header
        className={cn(
          "flex items-center justify-between px-10 pb-3",
          className,
        )}
      >
        <h1 className="text-3xl font-bold">{children}</h1>
        <ModeToggle />
      </header>
      <Separator className="h-px w-full border-b" />
    </>
  );
}
