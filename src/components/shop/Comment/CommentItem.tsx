import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: any; // replace with your Comment type
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    console.log("Reply:", replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Comment */}
      <div className="flex gap-2">
        <Avatar className="shrink-0">
          <AvatarImage src={comment.user?.avatar} />
          <AvatarFallback>{comment.user?.username?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span className="font-medium text-gray-700">{comment.user?.username}</span>
            <span>
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              {comment.isEdited && " • edited"}
            </span>
          </div>
          <p className={`text-gray-800 ${comment.isDeleted ? "line-through italic text-gray-400" : ""}`}>
            {comment.isDeleted ? "Comment deleted" : comment.content}
          </p>
          <div className="flex gap-2 mt-1 text-xs">
            {!comment.isDeleted && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                Reply
              </Button>
            )}
          </div>

          {/* Reply input */}
          {showReplyInput && !comment.isDeleted && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Write a reply..."
                className="flex-1 border rounded px-2 py-1"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button size="sm" onClick={handleReplySubmit}>
                Reply
              </Button>
            </div>
          )}

          {/* Replies */}
          <div className="mt-2 ml-8 space-y-2">
            {comment.replies?.map((reply: any) => (
              <div key={reply.id} className="flex gap-2">
                <Avatar className="shrink-0">
                  <AvatarImage src={reply.user?.avatar} />
                  <AvatarFallback>{reply.user?.username?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-sm">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{reply.user?.username}</span>
                    <span>
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      {reply.isEdited && " • edited"}
                    </span>
                  </div>
                  <p className={`text-gray-800 ${reply.isDeleted ? "line-through italic text-gray-400" : ""}`}>
                    {reply.isDeleted ? "Reply deleted" : reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;