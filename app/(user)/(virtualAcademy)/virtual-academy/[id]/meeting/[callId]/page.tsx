"use client";

import MeetingRoom from "@/components/organism/MeetingRoom";
import MeetingSetup from "@/components/organism/MeetingSetup";
import { useGetCallById } from "@/lib/hooks/useGetCallById";
import useUser from "@/lib/hooks/useUser";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { Loader } from "lucide-react";
import { useState } from "react";

const Meeting = ({ params }: { params: { id: string; callId: string } }) => {
  const { status } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(params.callId);
  console.log(params.callId);

  if (!status || isCallLoading) return <Loader className="animate-spin" />;
  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom callId={params.callId} academyId={params.id} />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
