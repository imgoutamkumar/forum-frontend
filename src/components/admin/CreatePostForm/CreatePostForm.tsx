import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useCreatePostMutation } from "@/redux/services/postApi"
import PostForm from "../CreateThreadForm/PostForm"

const CreateNewPostForm = ({ threadId }: { threadId: string }) => {

    const blockSchema = z.object({
        type: z.enum(["TEXT", "IMAGE", "VIDEO"]),
        content: z.string().optional(),
        media: z.object({
            existing: z
                .array(
                    z.object({
                        url: z.string(),
                        publicId: z.string().optional(), // optional but useful for deletion
                    })
                )
                .optional(),

            new: z
                .array(z.instanceof(File))
                .optional(),
        }).optional(),
    })

    const postSchema = z.object({
        post: z.object({
            blocks: z.array(blockSchema).min(1, "At least one block required")
        })
    })

    const [createPost, { isLoading }] = useCreatePostMutation()

    const form = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            post: {
                blocks: [
                    {
                        type: "TEXT",
                        content: "",
                        media: {
                            existing: [], // already uploaded (URLs)
                            new: []       // new File[]
                        }
                    }
                ]
            }
        }
    })

    const onSubmit = async (data: any) => {
        console.log("data:", data)
        try {
            const formData = new FormData()

            formData.append("threadId", threadId)

            const blocks = data.post.blocks.map((block: any) => {
                return {
                    type: block.type,
                    content: block.content || "",
                    // media will be handled separately
                }
            })

            // Append blocks as JSON string
            formData.append("blocks", JSON.stringify(blocks))

            // Append files separately
            data.post.blocks.forEach((block: any, index: number) => {
                if (block.media?.new?.length) { // check array exists
                    block.media.new.forEach((file: File) => {
                        formData.append(`block_${index}`, file)
                    })
                }
            })

            const res = await createPost(formData).unwrap()
            console.log("POST CREATED:", res)

            form.reset()

        } catch (err) {
            console.error("ERROR:", err)
        }
    }

    return (
        <div className="mb-4">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    {/* Only Post Blocks */}
                    <PostForm />

                    <div className="flex justify-end">
                        <Button
                            disabled={isLoading}
                            type="submit"
                        >
                            {isLoading ? "Posting..." : "Create Post"}
                        </Button>
                    </div>


                </form>
            </FormProvider>
        </div>
    )
}

export default CreateNewPostForm