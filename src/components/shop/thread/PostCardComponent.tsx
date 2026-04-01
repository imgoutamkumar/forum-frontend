import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from "react";
import VideoBlock from "../VideoBlock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Edit2, Heart, MessageSquareText, Reply } from "lucide-react";
import EditPostDialog from "@/components/admin/EditPostDialog";
import { useCreateCommentMutation, useLazyGetCommentsQuery } from "@/redux/services/commentApi";
import { Button } from "@/components/ui/button";
import { useCreateReplyMutation } from "@/redux/services/replyApi";

const PostCard = ({ post, threadId, postNumber }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [openRepliesCommentId, setOpenRepliesCommentId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [commentText, setCommentText] = useState("");

  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [createReply, { isLoading: isCreatingReply }] = useCreateReplyMutation();


  const [draftContent, setDraftContent] = useState(
    post?.blocks?.map((b: any) => ({ ...b }))
  );

  const [fetchComments, { data: commentsData, isLoading, isError }] =
    useLazyGetCommentsQuery();

  const handleSave = async () => {
    // await onUpdate(post.id, draftContent); // call API
    setIsEditing(false);
  };

  const showComments = (postId: string) => {
    setOpenCommentsPostId(prev => (prev === postId ? null : postId));

    // optional: fetch comments when opening
    if (openCommentsPostId !== postId) {
      fetchComments(postId);
    }
  };

  const handleCreateComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment({
        postId: post.id,
        content: commentText,
      }).unwrap();

      setCommentText("");

      // refetch comments after posting
      fetchComments(post.id);
    } catch (err) {
      console.error(err);
    }
  };


  const handleCreateReply = async (commentId: string) => {
    console.log("handleCreateReply")
    const content = replyTexts[commentId]?.trim();
    if (!content) return;

    try {
      await createReply({
        commentId,
        content,
      }).unwrap();

      // Clear input
      setReplyTexts(prev => ({ ...prev, [commentId]: "" }));

      // Refetch comments so the new reply appears
      fetchComments(post.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-x-2">

      <Card className="rounded-xl border shadow-sm gap-y-1">
        <CardContent className="pl-2 sm:pl-4 pr-2 sm:pr-4 pb-4 space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span className="flex items-center gap-2 font-medium text-gray-700">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-[13px]">{post?.user?.name || "Anonymous"}</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px]">
                {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                {post.updatedAt !== post.createdAt && " • edited"}
              </span>
              <button
                className="text-blue-500 hover:underline text-sm cursor-pointer  transform 
    transition 
    duration-300 
    ease-in-out 
    hover:scale-110"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : <Edit2 />}
              </button>
            </div>
          </div>
          {post?.blocks.map((block: any, i: number) => {

            switch (block.type) {

              case "TEXT":
                return (
                  <p
                    key={i}
                    className="text-[1rem] sm:text-[1.12rem] text-gray-800 whitespace-pre-line"
                  >
                    {block.content}
                  </p>
                )

              case "IMAGE":
                return (
                  <div className="flex flex-wrap px-2 sm:px-4">
                    {block?.media?.map((img: any, imgIdx: number) => (
                      <img
                        key={imgIdx}
                        src={img?.url}
                        alt="post"
                        loading="lazy"
                        className="w-full max-w-[210px] sm:max-w-[300px] object-cover rounded-lg" />
                    ))
                    }
                  </div>
                )

              case "VIDEO":
                return (
                  <>
                    {block?.media?.map((v: any, vIdx: number) => (
                      // <VideoBlock key={vIdx} src={v?.url} />
                      <div
                        key={vIdx}
                        className="rounded-lg overflow-hidden max-h-[450px] bg-black"
                      >
                        <VideoBlock
                          src={v?.url}
                          className="max-h-[450px] max-w-full object-contain"
                        />
                      </div>
                    ))}
                  </>
                )

              default:
                return null
            }
          })}

        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex flex-1 items-center justify-between gap-x-4">
            {/* Left side - actions */}
            <div className="flex items-center gap-4 text-gray-600">

              {/* Like */}
              <button className="flex items-center gap-1 hover:text-red-500 transition cursor-pointer">
                <Heart /> <span className="text-sm">{post?._count?.likes || 0}</span>
              </button>

              {/* Comment */}
              <button className="flex items-center gap-1 hover:text-blue-500 transition cursor-pointer" onClick={() => showComments(post?.id)}>
                <MessageSquareText /> <span className="text-sm">{post?.commentsCount || 0}</span>
              </button>

            </div>

            {/* Right side - optional */}
            <div className="text-xs text-gray-400">
              #{postNumber}
            </div>
          </div>
        </CardFooter>
      </Card>

      {openCommentsPostId === post.id && (
        <div className="mt-3 border-t pt-3">

          {/* Input box */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 min-w-0 border rounded px-3 py-1 text-sm"
            />

            <Button
              className="cursor-pointer bg-blue-500 text-white px-2 rounded text-sm"
              onClick={handleCreateComment}
            >
              {isCreatingComment ? "Sending..." : "Send"}
            </Button>
          </div>

          {/* Comments list */}
          <div className="mt-2 space-y-3">
            {isLoading && <div className="max-w-5xl mx-auto space-y-4 p-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              ))}
            </div>
            }

            {commentsData?.data?.map((comment: any) => (
              <div key={comment?.id} className="text-sm border-b pb-2">

                {/* Comment */}
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-[13px]">{post?.user?.name || "Anonymous"}</span>
                </span>
                <p className="font-medium max-w-[90%] m-auto text-[13px]">{comment?.content}</p>

                {/* Replies */}
                <div className="ml-4 mt-2 space-y-2">
                  {comment?.replies?.map((reply: any) => (
                    <div key={reply?.id} className="max-w-[80%] text-[13px] text-gray-700">

                      {/* Header */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Avatar className="size-6">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {reply?.user?.name || "Anonymous"}
                        </span>
                      </div>

                      {/* Reply content aligned under name */}
                      <div className="ml-8">
                        <span>↳ {reply.content}</span>
                      </div>

                    </div>
                  ))}
                </div>
                <div className="flex justify-end"><span className="flex gap-x-2 cursor-pointer text-sm hover:text-blue-500" onClick={() => setOpenRepliesCommentId(prev => (prev === comment.id ? null : comment.id))}>{openRepliesCommentId != comment.id && <span className="flex gap-x-2"> <Reply /> Reply</span>}</span> </div>
                {/* Reply input */}
                {openRepliesCommentId === comment.id && (<div className="ml-4 mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyTexts[comment.id] || ""}
                    onChange={(e) =>
                      setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))
                    }
                    className="flex-1 min-w-0 border rounded px-3 py-1 text-xs"
                  />
                  {openRepliesCommentId === comment.id && <Button
                    variant="outline"
                    className="px-2 rounded text-xs cursor-pointer"
                    onClick={() => setOpenRepliesCommentId(null)}
                  >
                    Cancel
                  </Button>}
                  <Button
                    className="bg-blue-500 text-white px-2 rounded text-xs cursor-pointer"
                    onClick={() => handleCreateReply(comment.id)}
                  >
                    Reply
                  </Button>
                </div>)}
              </div>
            ))}
          </div>
        </div>
      )}

      <EditPostDialog
        threadId={threadId}
        post={post}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </div>

  )
}

export default PostCard