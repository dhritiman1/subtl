import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  user?: Boolean;
  children: ReactNode;
};

export default function MainLayout({ children, user }: Props) {
  return (
    <main className="flex min-h-screen flex-row justify-center">
      <div className="sticky top-0 flex h-screen w-0 flex-col items-center gap-3 border-r border-zinc-800 py-1 md:w-14">
        {user && (
          <>
            <div className="h-[65px]">
              <Link href={"/"}>
                <Image
                  src={"/image.png"}
                  width={56}
                  height={56}
                  alt="application logo"
                />
              </Link>
            </div>
            <div className="h-[65px]">
              <UserButton
                afterSignOutUrl="/"
                appearance={{ baseTheme: dark }}
              />
            </div>
          </>
        )}
      </div>
      <div className="h-full w-full  md:max-w-2xl">{children}</div>
      <div className="sticky top-0 h-screen w-0 border-l border-zinc-800 md:w-14"></div>
    </main>
  );
}
