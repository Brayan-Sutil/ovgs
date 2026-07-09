"use client";

import { Building2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/provider";
import { companySession, createCustomerSession } from "@/auth/session";
import { useCustomers } from "@/features/customers/hooks";
import { Locale, localeNames, locales } from "@/i18n/messages";
import { useAppLocale } from "@/i18n/provider";

const LoginPage = () => {
  const router = useRouter();
  const tAuth = useTranslations("auth");
  const tLanguage = useTranslations("language");
  const { isReady, login, session } = useAuth();
  const { locale, setLocale } = useAppLocale();
  const customersQuery = useCustomers();
  const customers = customersQuery.data ?? [];
  const [customerSelectionOpen, setCustomerSelectionOpen] = useState(false);
  const [selectedCustomerDocument, setSelectedCustomerDocument] = useState("");
  const [customerNotice, setCustomerNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && session) {
      router.replace("/");
    }
  }, [isReady, router, session]);

  useEffect(() => {
    if (!customerSelectionOpen || selectedCustomerDocument || customers.length === 0) {
      return;
    }

    setSelectedCustomerDocument(customers[0].document);
  }, [customerSelectionOpen, customers, selectedCustomerDocument]);

  const enter = (nextSession: typeof companySession) => {
    login(nextSession);
    router.replace("/");
  };

  const openCustomerSelection = () => {
    setCustomerNotice(null);

    if (customersQuery.isError) {
      setCustomerNotice(tAuth("customerUnavailable"));
      setCustomerSelectionOpen(false);
      return;
    }

    if (customers.length === 0) {
      setCustomerNotice(tAuth("noCustomers"));
      setCustomerSelectionOpen(false);
      return;
    }

    setSelectedCustomerDocument(customers[0].document);
    setCustomerSelectionOpen(true);
  };

  const enterAsCustomer = () => {
    const customer = customers.find(
      (currentCustomer) => currentCustomer.document === selectedCustomerDocument
    );

    if (!customer) {
      setCustomerNotice(tAuth("customerUnavailable"));
      return;
    }

    login(createCustomerSession(customer));
    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-surface px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-center">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="text-lg font-bold text-ink">OVGS</div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span>{tLanguage("label")}</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              className="h-9 rounded-md border border-line bg-white px-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
            >
              {locales.map((availableLocale) => (
                <option key={availableLocale} value={availableLocale}>
                  {localeNames[availableLocale]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <section className="rounded-md border border-line bg-white p-5 sm:p-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-ink sm:text-3xl">{tAuth("loginTitle")}</h1>
            <p className="mt-2 text-sm text-slate-600">{tAuth("loginDescription")}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase text-slate-500">
              {tAuth("chooseProfile")}
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => enter(companySession)}
                className="group grid min-h-44 gap-4 rounded-md border border-line bg-white p-5 text-left transition hover:border-brand hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-100"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand text-white">
                  <Building2 size={22} aria-hidden />
                </span>
                <span>
                  <span className="block text-lg font-bold text-ink">
                    {tAuth("companyAccess")}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-600">
                    {tAuth("companyDescription")}
                  </span>
                </span>
              </button>

              <div className="grid min-h-44 gap-4 rounded-md border border-line bg-white p-5 text-left">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand text-white">
                  <UserRound size={22} aria-hidden />
                </span>
                <span>
                  <span className="block text-lg font-bold text-ink">
                    {tAuth("customerAccess")}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-600">
                    {tAuth("customerDescription")}
                  </span>
                </span>

                {customerNotice ? (
                  <div className="rounded-md bg-amber-50 p-3 text-sm font-medium text-amber-800">
                    {customerNotice}
                  </div>
                ) : null}

                {customerSelectionOpen ? (
                  <div className="grid gap-3">
                    <label className="grid gap-1.5 text-sm font-medium text-ink">
                      <span>{tAuth("selectCustomer")}</span>
                      <select
                        value={selectedCustomerDocument}
                        onChange={(event) => setSelectedCustomerDocument(event.target.value)}
                        className="h-10 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
                      >
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.document}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={enterAsCustomer}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!selectedCustomerDocument}
                    >
                      {tAuth("continueAsCustomer")}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openCustomerSelection}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-brand transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={customersQuery.isLoading}
                  >
                    {customersQuery.isLoading
                      ? tAuth("loadingCustomers")
                      : tAuth("customerAccess")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
