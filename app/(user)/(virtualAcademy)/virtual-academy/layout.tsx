import StreamChatProvider from "@/providers/StreamChatProviderClient";
import StreamVideoProvider from "@/providers/StreamProviderClient";
import React from "react";

function academyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <StreamChatProvider>
        <StreamVideoProvider>{children}</StreamVideoProvider>
      </StreamChatProvider>
    </div>
  );
}

export default academyLayout;
