import React from "react";
import { Badge } from "./ui/badge";

const NoticeIndicator = () => {
  return (
    <div className="fixed bottom-8 right-4 z-10">
      <Badge variant="outline" className="py-2 px-4 backdrop-blur-lg">
        <span className="h-2 w-2 bg-green-500 rounded-full inline-block mr-2" />
        Devnet (connected)
      </Badge>
    </div>
  );
};

export default NoticeIndicator;
