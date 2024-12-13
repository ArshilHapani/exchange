import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

import { HeroSection } from "@/components/hero-section";
import ProductCards from "@/components/ProductCard";
import { WalletCard } from "../components/WalletCard";
import db from "@/lib/drizzle";
import { InrWallet, SolWallet, User } from "@/db/schema";

export default async function Home() {
  const session = await getServerSession();
  let balance = 0;
  let userId = 0;
  let address = "";
  if (session?.user && session.user.email) {
    const resultArray = await db
      .select({
        userId: User.id,
        username: User.username,
        email: User.email,
        balance: InrWallet.inr,
        publicKey: SolWallet.publicKey,
      })
      .from(User)
      .leftJoin(InrWallet, eq(User.id, InrWallet.userId))
      .leftJoin(SolWallet, eq(User.id, SolWallet.userId))
      .where(eq(User.email, session.user.email))
      .limit(1);
    const result = resultArray[0];
    balance = result?.balance ?? 0;
    userId = result?.userId ?? 0;
    address = result?.publicKey ?? "";
  }

  return (
    <div className="h-full">
      <main>
        {session?.user ? (
          <WalletCard userAddress={address} balance={balance} userId={userId} />
        ) : (
          <>
            <HeroSection />
            <ProductCards />
          </>
        )}
      </main>
    </div>
  );
}
