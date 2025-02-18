"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import {client} from "@/lib/apolloClient";

// create ApolloProviderWrapper client component
export default function ApolloProviderWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
