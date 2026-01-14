"use client"
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../components/theme-provider";
import LoginPage from "./login/page";
 
export function Providers({ children, session }: { children: React.ReactNode, session?: any }) {
    return (
        <SessionProvider session={session}>
          
               <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
 {children }
          </ThemeProvider>
             
        </SessionProvider>
    );
}