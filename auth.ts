import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import addUser from './lib/server/functions/add-user';

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    signIn: async ({ user }) => {
      if (user) {
        await addUser({
          email: user.email!,
          name: user.name!,
          image: user.image!,
          uuid: crypto.randomUUID(),
        });
      }
      return true;
    },
  },
  providers: [
    Google({
      clientId: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,

      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  secret: process.env['NEXTAUTH_SECRET']!,
});
