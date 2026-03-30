import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from "react";
import VideoBlock from "../VideoBlock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Edit2, Heart, MessageSquareText } from "lucide-react";
import EditPostDialog from "@/components/admin/EditPostDialog";
import { useLazyGetCommentsQuery } from "@/redux/services/commentApi";

const PostCard = ({ post, threadId, postNumber }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [draftContent, setDraftContent] = useState(
    post?.blocks?.map((b: any) => ({ ...b }))
  );

  const [fetchComments, { data, isLoading, isError }] =
    useLazyGetCommentsQuery();

  const handleSave = async () => {
    // await onUpdate(post.id, draftContent); // call API
    setIsEditing(false);
  };

  const showComments = async (postId) => {
    try {
      const data = await fetchComments(postId).unwrap();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex gap-x-2">

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
                <Heart /> <span className="text-sm">{post?.likes || 0}</span>
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