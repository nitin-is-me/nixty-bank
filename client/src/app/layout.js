import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "Nixty bank",
  description: "Make fast and secure payments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
