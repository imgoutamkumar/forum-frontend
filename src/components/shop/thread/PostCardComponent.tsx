import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react";
import VideoBlock from "../VideoBlock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Edit, Edit2 } from "lucide-react";
import EditPostDialog from "@/components/admin/EditPostDialog";

const PostCard = ({ post }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [draftContent, setDraftContent] = useState(
    post?.blocks?.map((b) => ({ ...b }))
  );

  const handleSave = async () => {
    // await onUpdate(post.id, draftContent); // call API
    setIsEditing(false);
  };

  return (
    <div className="flex gap-x-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Card className="rounded-xl border shadow-sm">
        <CardContent className="pl-4 pr-4 pb-4 space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {post?.user?.name || "Anonymous"}
            </span>

            <div className="flex items-center gap-2">
              <span>
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
                    className="text-[1.15rem] text-gray-800 whitespace-pre-line"
                  >
                    {block.content}
                  </p>
                )

              case "IMAGE":
                return (
                  <div className="flex flex-wrap px-4">
                    {block?.media?.map((img: any, imgIdx: number) => (
                      <img
                        key={imgIdx}
                        src={img?.url}
                        alt="post"
                        loading="lazy"
className="w-full max-w-[210px] sm:max-w-[300px] object-cover rounded-lg"                      />
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
      </Card>

      <EditPostDialog
        post={post}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </div>

  )
}

export default PostCard