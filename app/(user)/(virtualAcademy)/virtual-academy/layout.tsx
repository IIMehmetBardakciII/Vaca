import StreamVideoProvider from "@/providers/StreamProviderClient";
import React from "react";

function academyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </div>
  );
}

export default academyLayout;
