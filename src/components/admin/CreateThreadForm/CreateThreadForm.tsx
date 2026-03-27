import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import PostForm from "./PostForm"
import { CustomInput } from "@/customComponent/input"
// import { Form } from '@/components/ui/form';
import { CustomSelect } from "@/customComponent/select"
import { Button } from "@/components/ui/button"
import { useCreateThreadMutation } from "@/redux/services/threadApi"
import { useGetCategoriesQuery } from "@/redux/services/categoryApi"



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
    blocks: z.array(blockSchema).min(1, "At least one block required")
})

const threadSchema = z.object({
    title: z.string().min(3),
    categoryId: z.string().uuid("Invalid category"),
    post: postSchema
})

const CreateThreadForm = () => {
    const {data:categories, isLoading:isCategoryDataLoading} = useGetCategoriesQuery()
    const [createThread, { isLoading }] = useCreateThreadMutation()

const categoryOptions = categories.data.map((category: any) => ({
  label: category.name,
  value: category.id
}));

    const form = useForm({
        resolver: zodResolver(threadSchema),
        defaultValues: {
            title: "",
            categoryId: "",
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
        console.log("FINAL DATA:", data)

        try {
            const formData = new FormData()

            formData.append("title", data.title)
            formData.append("categoryId", data.categoryId)

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

            const res = await createThread(formData).unwrap()
            console.log("SUCCESS:", res)
            form.reset()
        } catch (err) {
            console.error("ERROR:", err)
        }
    }

    return (
        <div className="mb-4">
            <FormProvider {...form}>
                {/* <Form {...form}> */}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* <input {...form.register("title")} placeholder="Thread Title" /> */}
                    <CustomInput control={form.control} name="title" label="Title" />
                    <div className="grid sm:grid-cols-3">
                        <CustomSelect control={form.control} name="categoryId" label="Category ID" options={categoryOptions} />
                    </div>

                    {/* Post Section */}
                    <PostForm />

                    <Button
                        className="w-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isLoading}
                        type="submit">
                        {isLoading ? "Creating..." : "Create"}
                    </Button>
                </form>
                {/* </Form> */}
            </FormProvider>
        </div>
    )
}

export default CreateThreadForm