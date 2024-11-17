"use client";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { deleteClass } from "@/lib/actions/updateVirtualAcademyForVirtualClass";
type EndCallButtonProps = {
  callId: string;
  academyId: string;
};
const EndCallButton = ({ academyId, callId }: EndCallButtonProps) => {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwener =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;
  if (!isMeetingOwener) return null;
  return (
    <Button
      variant={"destructive"}
      onClick={async () => {
        await call.endCall();
        router.push("/");
        await deleteClass(academyId, callId);
      }}
    >
      Dersi Bitir
    </Button>
  );
};

export default EndCallButton;
