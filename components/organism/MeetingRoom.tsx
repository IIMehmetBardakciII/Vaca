import { cn } from "@/lib/utils";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { LayoutList, Loader, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";
type MeetingRoomProps = {
  callId: string;
  academyId: string;
};
const MeetingRoom = ({ callId, academyId }: MeetingRoomProps) => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED)
    return <Loader className="animate-spin" />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition={"left"} />;
      default:
        return <SpeakerLayout participantsBarPosition={"right"} />;
    }
  };
  return (
    <section className="relative h-[calc(100vh-40px)] w-full overflow-hidden   ">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center text-secondary">
          <CallLayout />
        </div>
        <div
          className={cn(
            "h-[calc(100vh-60px)] hidden ml-10 text-secondary px-4 py-2 bg-primary rounded-md",
            {
              "show-block": showParticipants,
            }
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      <div className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-5 text-secondary ">
        <CallControls />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl  bg-primary px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-secondary" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border border-primary bg-primary text-secondary ">
            {["Grid", "Speaker-left", "Speaker-right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border border-primary" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-xl bg-primary px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-secondary" />
          </div>
        </button>
        {!isPersonalRoom && (
          <EndCallButton callId={callId} academyId={academyId} />
        )}
      </div>
    </section>
  );
};

export default MeetingRoom;
