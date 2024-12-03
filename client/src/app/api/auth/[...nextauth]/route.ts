import NextAuth from "next-auth";
import { eq } from "drizzle-orm";
import GoogleProvider from "next-auth/providers/google";
import { Keypair } from "@solana/web3.js";

import { InrWallet, SolWallet, User } from "@/db/schema";
import db from "@/lib/drizzle";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (
        account?.provider === "google" &&
        account.type === "oauth" &&
        user.email &&
        user.name
      ) {
        // check if user exists in db
        const existingUser = await db
          .select()
          .from(User)
          .where(eq(User.username, user.name));

        if (existingUser.length > 0) {
          return true;
        }
        const keypair = Keypair.generate();
        const userId = await db
          .insert(User)
          .values({
            username: user.name,
            email: user.email,
            provider: "google",
          })
          .returning({ id: User.id });
        const [solWallet, inrWallet] = await Promise.all([
          await db
            .insert(InrWallet)
            .values({
              inr: 0,
              userId: userId[0].id,
            })
            .returning({ id: InrWallet.id }),
          await db
            .insert(SolWallet)
            .values({
              publicKey: keypair.publicKey.toBase58(),
              privateKey: keypair.secretKey.toString(),
              userId: userId[0].id,
            })
            .returning({ id: SolWallet.id }),
        ]);

        await db
          .update(User)
          .set({
            solWalletId: solWallet[0].id,
            inrWalletId: inrWallet[0].id,
          })
          .where(eq(User.id, userId[0].id));

        return true;
      }

      return false;
    },
  },
  debug: process.env.NODE_ENV === "development" && false, // circuit switch
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "",
});

export { handler as GET, handler as POST };
