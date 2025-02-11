import type { Metadata } from "next";
import "@/app/globals.css";
import NavigationBar from "@/components/NavigationBar";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
    search,
}: Readonly<{
    children: React.ReactNode;
    search: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="flex flex-col">
                    <NavigationBar />
                    <div className="flex">{search}</div>
                </div>
            </body>
        </html>
    );
}
