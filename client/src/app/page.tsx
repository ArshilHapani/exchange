import { getServerSession } from "next-auth";

import { HeroSection } from "@/components/hero-section";
import ProductCards from "@/components/ProductCard";
import { WalletCard } from "../components/WalletCard";
import db from "@/lib/drizzle";
import { InrWallet, User } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const session = await getServerSession();
  let balance = 0;
  let userId = 0;
  if (session?.user && session.user.email) {
    const result = await db
      .select({
        userId: User.id,
        username: User.username,
        email: User.email,
        balance: InrWallet.inr,
      })
      .from(User)
      .leftJoin(InrWallet, eq(User.id, InrWallet.userId))
      .where(eq(User.email, session.user.email))
      .limit(1);
    balance = result[0].balance ?? 0;
    userId = result[0].userId ?? 0;
  }

  return (
    <div className="min-h-screen bg-gradient-to-l from-blue-50 to-white">
      <main>
        {session?.user ? (
          <WalletCard balance={balance} userId={userId} />
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
