import prisma from '@/lib/prisma'; // Your singleton Prisma client
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    // 2. Providers: Define the authentication methods
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],

    // 3. Callbacks
    callbacks: {
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.username = (user as any).username;
                token.isVerified = (user as any).isVerified;
                
                // Safely handle Date objects for JWT
                if ((user as any).createdAt && (user as any).createdAt instanceof Date) {
                    token.createdAt = (user as any).createdAt.toISOString();
                } else {
                    token.createdAt = (user as any).createdAt;
                }
                token.points = (user as any).points;
            }

            // Handle Profile Switching (Update session via client-side update())
            if (trigger === "update" && session?.activeStudentId) {
                token.activeStudentId = session.activeStudentId;
            }
            if (trigger === "update" && session?.activeStudentId === null) {
                delete token.activeStudentId;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.role = token.role as string;
                session.user.username = token.username as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.createdAt = token.createdAt as Date;
                session.user.points = token.points as number || 0;
            }
            return session;
        },
    },

    debug: true,

    // 4. Session Configuration
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    // 5. Pages
    pages: {
        signIn: '/login',
        newUser: '/login', // Redirect to login for registration too since it's Google only
        error: '/auth/error',
    },

    // 6. Secret
    secret: process.env.NEXTAUTH_SECRET,
};
