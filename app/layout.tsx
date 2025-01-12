import type { Metadata } from "next";
import { Electrolize, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./globalComponents/Header/Header";

const electrolize = Electrolize({
    subsets: ["latin"],
    weight: ["400"],
});

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"],
});

export const metadata: Metadata = {
    title: "keytyper",
    description: "key type game test",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${electrolize.className} ${montserrat.className}`}>
                <Header />
                {children}
            </body>
        </html>
    );
}
