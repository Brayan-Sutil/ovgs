import { ReactNode } from "react";

type CrudPageLayoutProps = {
  form: ReactNode;
  list: ReactNode;
};

export const CrudPageLayout = ({ form, list }: CrudPageLayoutProps) => {
  return (
    <div className="grid min-w-0 max-w-full gap-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-md border border-line bg-white p-5">{form}</section>
      <section className="min-w-0 rounded-md border border-line bg-white p-5">{list}</section>
    </div>
  );
};
