"use client";

import { Plus, Timer } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddINRFundDialog from "@/components/dialogs/AddINRFundDialog";
import { Skeleton } from "@/components/ui/skeleton";
import Address from "./Address";
import TokenCard from "./TokenCard";
import WithDrawFundModal from "./dialogs/WithDrawFundModal";
import SwapAssetsModal from "./dialogs/SwapAssetsModal";

import useModal from "@/hooks/useDialog";
import { getAvailableTokenBalanceAndTotalBalance } from "@/lib/interactions/getters";

type Props = {
  balance: number;
  userId: number;
  userAddress: string;
};

export function WalletCard({ balance, userId, userAddress }: Props) {
  const session = useSession();
  const { openModal } = useModal();
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["userBalance", userAddress],
    queryFn: () => getAvailableTokenBalanceAndTotalBalance(userAddress),
  });
  if (isError) {
    toast.error(`Failed to fetch account balance due to '${error.message}'`);
  }
  return (
    <>
      <Card className="w-full mt-[100px] max-w-3xl mx-auto transition-all duration-150 hover:drop-shadow-xl">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={session?.data?.user?.image ?? ""}
                alt={session?.data?.user?.name ?? "Arshil"}
              />
              <AvatarFallback>
                {session?.data?.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">
              Welcome back, {session?.data?.user?.name}!
            </h2>
          </div>
          {/* address component */}
          <Address address={userAddress} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Timer size={20} />
              CryptoLink Account Assets
            </div>
            <div className="flex justify-between">
              {/* crypto balance component */}
              <div className="flex items-baseline gap-1">
                <div className="flex items-end gap-2 text-4xl font-bold">
                  $
                  <>
                    {isLoading ? (
                      <Skeleton className="h-[40px] w-[100px]" />
                    ) : (
                      <>{data?.data?.totalBalance.toFixed(4)}</>
                    )}
                  </>
                </div>
                <span className="text-xl text-muted-foreground">USD</span>
              </div>

              {/* inr balance component */}
              <div className="flex items-baseline gap-1">
                <div className="flex items-end gap-2 text-4xl font-bold">
                  ₹{balance}
                </div>
                <span className="text-xl text-muted-foreground">INR</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700">Send</Button>
              <Button
                variant="secondary"
                onClick={() => openModal("add-inr-funds")}
              >
                Add Funds
              </Button>
              <Button
                variant="secondary"
                onClick={() => openModal("withdraw-funds")}
              >
                Withdraw
              </Button>
              <Button
                variant="secondary"
                onClick={() => openModal("swap-assets")}
              >
                Swap
              </Button>
            </div>
          </div>

          <Tabs defaultValue="tokens" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger disabled value="nfts">
                NFTs
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="tokens" className="py-4">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton
                      key={idx + "Skeleton"}
                      className="h-[80px] w-full rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <>
                  {data?.data?.balance.map((item, idx) => (
                    <div key={item.token + idx + "CARD_TOKEN"}>
                      <TokenCard data={item} userAddress={userAddress} />
                    </div>
                  ))}
                </>
              )}
            </TabsContent>
            <TabsContent value="nfts" className="py-4">
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">No NFTs found</p>
                <p className="text-sm text-muted-foreground">
                  Start by buying or receiving NFTs
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Buy NFTs
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="activity" className="py-4">
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">No activity yet</p>
                <p className="text-sm text-muted-foreground">
                  Your transaction history will appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* dialogs */}
      <AddINRFundDialog userId={userId} />
      <WithDrawFundModal availableInrBalance={balance} usrId={userId} />
      <SwapAssetsModal
        data={data?.data?.balance ?? []}
        userAddress={userAddress}
      />
    </>
  );
}
