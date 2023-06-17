import { PropsWithChildren } from "react";

export default function MainLayout(props: PropsWithChildren) {
  return (
    <main className="flex max-h-max min-h-screen flex-col items-center">
      <div className="h-screen max-h-max w-full md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
}
