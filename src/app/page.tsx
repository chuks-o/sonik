"use client";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen gap-3 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-3xl font-bold">Welcome to Sonik</h1>
      <div className="flex items-center gap-4">
        <OrganizationSwitcher />
        <UserButton />
      </div>
    </div>
  );
}
