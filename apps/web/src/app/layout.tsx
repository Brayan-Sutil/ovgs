import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "OVGS",
  description: "Sistema de Gestao de Ordens de Venda"
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
