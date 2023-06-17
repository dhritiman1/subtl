import { PropsWithChildren } from "react";

export default function MainLayout(props: PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-row justify-center">
      <div className="sticky top-0 flex h-screen w-14 flex-col gap-3"></div>
      <div className="h-full w-full border-x border-zinc-800 md:max-w-2xl">
        {props.children}
      </div>
      <div className="sticky top-0 h-screen w-14"></div>
    </main>
  );
}
