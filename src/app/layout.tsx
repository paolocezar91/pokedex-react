'use client';

import "@/app/globals.css";
import Head from "next/head";
import Header from "../components/header/header";
import "./layout.scss";

export default function RootLayout({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title: string
}>) {
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <div className="container mx-auto">
        <Header title={ title } />
        <main className="p-4">
          {children}
        </main>
      </div>
    </>
  );
}
