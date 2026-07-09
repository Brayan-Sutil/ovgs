import { ReactNode } from "react";

type DetailPageLayoutProps = {
  main: ReactNode;
  aside: ReactNode;
};

export const DetailPageLayout = ({ main, aside }: DetailPageLayoutProps) => {
  return (
    <div className="grid min-w-0 max-w-full gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
      <section className="min-w-0 max-w-full">{main}</section>
      <aside className="min-w-0 max-w-full">{aside}</aside>
    </div>
  );
};
