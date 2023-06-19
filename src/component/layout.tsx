import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  user?: Boolean;
  children: ReactNode;
};

export default function MainLayout({ children, user }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-row justify-center"
    >
      <div className="sticky top-0 hidden h-screen w-0 flex-col items-center gap-3 border-r border-zinc-800 py-1 md:flex md:w-14">
        {user && (
          <>
            <div className="h-[65px]">
              <Link href={"/"}>
                <Image
                  src={"/image.png"}
                  width={56}
                  height={56}
                  alt="application logo"
                  priority={true}
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
      <div className="min-h-screen w-full  md:max-w-2xl">
        {children}
        {user && (
          <>
            {" "}
            <div className="sticky bottom-0 flex h-[60px] w-full items-center justify-center backdrop-blur-md md:hidden">
              <div className="flex w-[75%] justify-around">
                <div className="w-20">
                  <Link className="h-8 w-8" href={"/"}>
                    <Image
                      src={"/home.png"}
                      height={32}
                      width={32}
                      alt="go to home page"
                    />
                  </Link>
                </div>
                <div className="flex w-20 justify-end">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-800 via-slate-800 to-zinc-800">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{ baseTheme: dark }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="sticky top-0 hidden h-screen w-0 border-l border-zinc-800 md:flex md:w-14"></div>
    </motion.main>
  );
}
