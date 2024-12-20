import { MessageSquareText } from "lucide-react";
import { Button } from "../ui/button";

const CommentButton = () => {
  return (
    <>
      <Button asChild variant={"ghost"} className="justify-start w-fit ">
        <p className="cursor-pointer hover:bg-green-400 group">
          <MessageSquareText
            size={18}
            className="stroke-muted-foreground group-hover:stroke-white"
          />
          <span className="text-lg text-muted-foreground group-hover:text-white ">
            Yorum Yap
          </span>
        </p>
      </Button>
    </>
  );
};

export default CommentButton;
