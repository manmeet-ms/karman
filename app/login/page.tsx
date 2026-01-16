
"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowRight, IconBrandGoogle } from "@tabler/icons-react";
import { AuthHeader } from "@/components/Headers";
import Link from "next/link";

export default function LoginPage() {
     const session = useSession()
       
    return (
        <>
        <AuthHeader/>

         {session?.status === 'authenticated' ? (
                      
                     <div className="py-24 flex items-center justify-center px-4">
            <Card className="mx-auto  ">
                <CardHeader>
                    <CardTitle className="text-2xl">You are authenticated as {session.data.user.name}</CardTitle>
                    <CardDescription className="text-muted-foreground/60" >
                        Click the button below to access the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Link href={"/"}><Button className="w-full"  >
                            Go to dashboard 
                            <IconArrowRight className="mr-2 h-4 w-4" />
                        </Button></Link>
                    </div>
                    {/* <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <span className="underline cursor-pointer" onClick={() => signIn("google", { callbackUrl: "/" })}>Sign up</span>
                    </div> */}
                </CardContent>
            </Card> 
        </div>
        ) : (
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
                        <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
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
                    )}
       
        </>
    );
}
