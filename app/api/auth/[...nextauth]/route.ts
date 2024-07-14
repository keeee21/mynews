import { ulid } from 'ulid';
import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { User } from '@prisma/client';
const prisma = new PrismaClient();

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email;

      // 既存のユーザーを検索
      const existingUser = await prisma.user.findUnique({
        where: { email: email ?? '' },
      });

      if (!existingUser) {
        // ユーザーが存在しない場合、新しいユーザーを作成
        await prisma.user.create({
          data: {
            id: ulid(),
            name: user.name ?? '',
            email: user.email ?? '',
          },
        });
      }

      return true; // サインインを許可
    },
    async session({ session }) {
      const sessionUser = session.user ?? { name: '', email: '' };

      if (!sessionUser.email || !sessionUser.name) {
        // ユーザー情報が不足している場合は何もせずにセッションを返す
        return session;
      }

      let user = await prisma.user.findUnique({
        where: { email: sessionUser.email },
      });

      if (!user) {
        // ユーザーが存在しない場合は作成する
        user = await prisma.user.create({
          data: {
            id: ulid(),
            name: sessionUser.name,
            email: sessionUser.email,
          },
        });
      }

      session.user = user as User;
      return session;
    },
  },
});
export { handler as GET, handler as POST };
