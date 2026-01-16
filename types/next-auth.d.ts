
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      username?: string | null
      isVerified?: boolean
      createdAt?: Date | string
      points: number
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    username?: string | null
    isVerified?: boolean
    createdAt?: Date
    points: number
  }
}
