import { useFieldArray, useFormContext } from "react-hook-form"
import PostBlockForm from "./PostBlockForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const PostForm = () => {
    const { control } = useFormContext()

    // 👉 Extract 'move' from useFieldArray
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "post.blocks"
    })

    return (
        <div className="">
            <h3 className="text-2xl font-bold mb-2">Post Content</h3>

            {fields.map((field, index) => (
                <PostBlockForm
                    key={field.id}
                    index={index}
                    remove={remove}
                    move={move} // 👉 Pass move function down
                    totalBlocks={fields.length} // 👉 Pass total length to disable buttons at edges
                />
            ))}

            <Button
                className="rounded-full border-blue-500 text-blue-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mb-2 mt-4"
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