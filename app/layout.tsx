import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import { Toaster } from "react-hot-toast"
import ReduxProvider from "./redux/essentials/ReduxProvider";
import ToastProvider from "./client/utils/ToastContainer";


const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "School Management App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ReduxProvider>
          <Toaster />
          {children}
          <ToastProvider />
        </ReduxProvider>
      </body>
    </html>
  );
}
