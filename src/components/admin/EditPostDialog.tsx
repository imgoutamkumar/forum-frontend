import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm, FormProvider } from "react-hook-form"
import PostForm from "./CreateThreadForm/PostForm"

interface EditPostDialogProps {
  post: any
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

const EditPostDialog = ({ post, isOpen, onClose, onSave }: EditPostDialogProps) => {
  // Initialize react-hook-form with the existing post data
  const methods = useForm({
    defaultValues: {
      post: post
    }
  })

  const handleSubmit = (data: any) => {
    onSave(data.post) // send updated post to parent or API
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[320px] sm:w-[800px] max-w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
            <PostForm />
            <DialogFooter className="flex justify-end gap-2">
              <Button className="cursor-pointer" variant="outline" onClick={onClose}>Cancel</Button>
              <Button className="cursor-pointer" type="submit">Save</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default EditPostDialog