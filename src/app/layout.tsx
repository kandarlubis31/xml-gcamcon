import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "xml-gcamcon — GCam Config Maker",
  description: "Create, edit, and generate XML config files for Google Camera (GCam) ports. Supports BSG, LMC, Arnova, AGC, and more.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("gcamcon_theme");if(t==="dark")document.documentElement.className="dark";else if(t==="light")document.documentElement.className="light";else document.documentElement.className=""}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          {children}
          <footer className="text-center py-4 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
            xml-gcamcon — GCam Config Maker · Made with ❤️ for the GCam community
          </footer>
        </ErrorBoundary>
      </body>
    </html>
  );
}
