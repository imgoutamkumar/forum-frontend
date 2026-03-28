import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm, FormProvider } from "react-hook-form"
import PostForm from "./CreateThreadForm/PostForm"
import { useEffect } from "react"
import { X } from "lucide-react"
import { useUpdatePostMutation } from "@/redux/services/postApi"

interface EditPostDialogProps {
  threadId: string
  post: any
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

const EditPostDialog = ({ post, isOpen, onClose, threadId }: EditPostDialogProps) => {
  const [updatePost, { isLoading }] = useUpdatePostMutation()
  const methods = useForm({
    defaultValues: {
      post: {
        blocks: []
      }
    }
  })

  useEffect(() => {
    if (post && isOpen) {
      methods.reset({
        post: {
          blocks: post.blocks.map((block: any) => ({
            id: block.id,
            type: block.type,
            content: block.content,
            media: {
              existing: block.media || [],
              new: []
            }
          }))
        }
      })
    }
  }, [post, isOpen])

  // Initialize react-hook-form with the existing post data
  // const methods = useForm({
  //   defaultValues: {
  //     post: post
  //   }
  // })


  const handleSubmit = async (data: any) => {
    console.log("data:", data)

    try {
      const formData = new FormData()

      formData.append("threadId", threadId)
      formData.append("postId", post.id)

      const blocks = data.post.blocks.map((block: any) => {
        console.log("block", block)
        return {
          id: block.id || null,
          type: block.type,
          content: block.content || "",
          media: {
            existing: block.media?.existing || [] // 👈 keep track
          }
        }
      })

      // Send structured data
      formData.append("blocks", JSON.stringify(blocks))

      // Send new files
      data.post.blocks.forEach((block: any, index: number) => {
        if (block.media?.new?.length) {
          block.media.new.forEach((file: File) => {
            formData.append(`block_${index}`, file)
          })
        }
      })

      const res = await updatePost({ threadId, formData }).unwrap()
      console.log("POST UPDATED:", res)
      onClose()

    } catch (err) {
      console.error("ERROR:", err)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="p-0 max-w-full sm:w-[800px]  h-[80vh] mx-2 sm:mx-0">
        <DialogHeader className="sticky top-0 z-20 bg-white border-b flex flex-row items-center justify-between rounded-[0.625rem] py-1 px-2">
          <DialogTitle className="px-4">Edit Post</DialogTitle>

          <Button
            variant="outline"
            onClick={onClose}
            className="px-2 rounded-full hover:bg-gray-100 size-9 cursor-pointer hover:border-red-600 hover:text-red-600"
          >
            <X />
          </Button>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 overflow-hidden h-full">
            <PostForm />
            <DialogFooter className="flex justify-end gap-2">
              <Button className="cursor-pointer" variant="outline" onClick={onClose}>Cancel</Button>
              <Button className="cursor-pointer hover:bg-blue-600" type="submit">{isLoading ? "Saving..." : "Save"}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default EditPostDialog