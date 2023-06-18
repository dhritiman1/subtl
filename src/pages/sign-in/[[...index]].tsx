import { dark } from "@clerk/themes";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        appearance={{
          baseTheme: dark,
          layout: {
            socialButtonsVariant: "iconButton",
            showOptionalFields: false,
          },
          elements: {
            formButtonPrimary: "bg-zinc-700 hover:bg-zinc-800",
          },
        }}
      />
    </div>
  );
}
