import { ReactNode } from "react";

type DetailPageLayoutProps = {
  main: ReactNode;
  aside: ReactNode;
};

export function DetailPageLayout({ main, aside }: DetailPageLayoutProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="min-w-0">{main}</section>
      <aside className="min-w-0">{aside}</aside>
    </div>
  );
}
