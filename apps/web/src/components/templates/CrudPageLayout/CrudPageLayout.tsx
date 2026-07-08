import { ReactNode } from "react";

type CrudPageLayoutProps = {
  form: ReactNode;
  list: ReactNode;
};

export const CrudPageLayout = ({ form, list }: CrudPageLayoutProps) => {
  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-md border border-line bg-white p-5">{form}</section>
      <section className="min-w-0 rounded-md border border-line bg-white p-5">{list}</section>
    </div>
  );
};
