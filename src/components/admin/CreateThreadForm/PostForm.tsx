import { useFieldArray, useFormContext } from "react-hook-form"
import PostBlockForm from "./PostBlockForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const PostForm = () => {
    const { control } = useFormContext()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "post.blocks"
    })

    return (
        <div className="p-2">
            <h3 className="text-2xl font-bold mb-2">Post Content</h3>

            {fields.map((field, index) => (
                <PostBlockForm
                    key={field.id}
                    index={index}
                    remove={remove}
                />
            ))}

            <button
                type="button"
                onClick={() =>
                    append({
                        type: "TEXT",
                        content: ""
                    })
                }
            >

            </button>
            <Button
                className="rounded-full border-blue-500 text-blue-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                type="button"
                variant="outline"
                onClick={() =>
                    append({
                        type: "TEXT",
                        content: ""
                    })
                }>
                <Plus />
                Add Block
            </Button>
        </div>
    )
}

export default PostForm