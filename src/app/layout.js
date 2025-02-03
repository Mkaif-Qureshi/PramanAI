import "./globals.css";
import Header from './components/Header';
import Footer from './components/Footer';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "PramanAI",
  description: "Legal data extraction with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
