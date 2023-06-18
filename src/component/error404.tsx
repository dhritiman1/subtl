import MainLayout from "./layout";

export default function Error() {
  return (
    <MainLayout>
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="text-4xl font-extralight">Error 404</div>
        <div className="mb-24 text-xl font-light">please try again later</div>
      </div>
    </MainLayout>
  );
}
