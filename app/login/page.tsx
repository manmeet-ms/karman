
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: process.env.NEXTAUTH_URL })}>
                            <IconBrandGoogle className="mr-2 h-4 w-4" />
                            Continue with Google
                        </Button>
                    </div>
                    {/* <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <span className="underline cursor-pointer" onClick={() => signIn("google", { callbackUrl: "/" })}>Sign up</span>
                    </div> */}
                </CardContent>
            </Card> 
        </div>
    );
}
