import { prisma } from '@/lib/prisma'
import type { DefaultSession, NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compareSync } from 'bcryptjs'
import 'next-auth/jwt'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: number
    phone: string
  }

  interface Session {
    user: {
      id: string
      role: number
      phone: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: number
    phone: string
  }
}

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        phone: { label: '手机号', type: 'text' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null

        const user = await prisma.user.findFirst({
          where: { phone: credentials.phone as string },
          include: { profile: true }
        })

        if (!user || !user.passwordHash || !user.isActive) return null

        if (!compareSync(credentials.password as string, user.passwordHash)) return null

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id.toString(),
          email: user.email,
          phone: user.phone ?? '',
          contact: user.profile?.contact,
          shopName: user.profile?.shopName,
          role: user.role,
          avatar: user.avatar
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnHome = nextUrl.pathname.startsWith('/home')
      const isOnSystem = nextUrl.pathname.startsWith('/system')

      if (isOnHome || isOnSystem) {
        if (isLoggedIn) return true
        return false
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.phone = (user as any).phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as number
        session.user.phone = token.phone as string
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  }
} satisfies NextAuthConfig

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig)
