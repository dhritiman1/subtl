import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp
        appearance={{
          baseTheme: dark,
          layout: {
            socialButtonsVariant: "iconButton",
            logoPlacement: "inside",
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
