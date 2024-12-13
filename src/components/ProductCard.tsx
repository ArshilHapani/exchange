import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Zap, Box } from "lucide-react";

export default function ProductCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 mb-20">
      <Card>
        <CardHeader>
          <Box className="w-10 h-10 text-blue-500 mb-2" />
          <CardTitle>Wallet Adapter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Make Solana apps consumer-ready.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Zap className="w-10 h-10 text-blue-500 mb-2" />
          <CardTitle>Pro Version</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Send digital assets at scale, even to non-crypto users.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Wallet className="w-10 h-10 text-blue-500 mb-2" />
          <CardTitle>Basic Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">The world&apos;s simplest wallet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
