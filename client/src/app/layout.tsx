import type { Metadata } from "next";
import ApolloProviderWrapper from "@/lib/ApolloProviderWrapper";
import QueryProvider from "@/lib/QueryProvider"; // Import the QueryProvider
import './globals.css'
import NavBar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A full-stack Todo application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProviderWrapper>
          <QueryProvider>
            <NavBar />
            {children}
            </QueryProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}


