import { Button } from "@/components/ui/button"
import FileUpload from "@/customComponent/fileupload"
import { CustomSelect } from "@/customComponent/select"
import { CustomTextarea } from "@/customComponent/textarea"
import { Trash2 } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"

const blockTypeOptions = [
  {
    label: "TEXT",
    value: "TEXT"
  },
  {
    label: "IMAGE",
    value: "IMAGE"
  },
  {
    label: "VIDEO",
    value: "VIDEO"
  }
]

const PostBlockForm = ({ index, remove }) => {
  const { control, setValue } = useFormContext()

  const type = useWatch({
    control,
    name: `post.blocks.${index}.type`
  })

  const medias = useWatch({
    control,
    name: `post.blocks.${index}.media`,
    defaultValue: []
  })

  return (
    <div className="relative rounded-2xl border border-gray-300 p-4 mb-2">
      <h3 className="text-[1rem] font-bold mb-2">Block {index + 1}</h3>
      {/* Type Selector */}
      {/* <select {...register(`post.blocks.${index}.type`)}>
                <option value="TEXT">TEXT</option>
                <option value="IMAGE">IMAGE</option>
                <option value="VIDEO">VIDEO</option>
            </select> */}
      <div className="grid sm:grid-cols-3">
        <CustomSelect control={control} name={`post.blocks.${index}.type`} label="Category ID" options={blockTypeOptions} />
      </div>

      {/* TEXT */}
      {type === "TEXT" && (
        // <textarea
        //     {...register(`post.blocks.${index}.content`)}
        //     placeholder="Enter text..."
        // />
        <CustomTextarea control={control} name={`post.blocks.${index}.content`} label="Title" />

      )}

      {/* IMAGE */}
      {(type === "IMAGE") && (
        // <input
        //     type="file"
        //     multiple
        //     onChange={(e) => {
        //         console.log(e.target.files)
        //     }}
        // />
        <FileUpload inputId={`post.blocks.${index}`} selectedFiles={medias}
          onChange={(files) => {
            setValue(`post.blocks.${index}.media`, files, { shouldDirty: true })
            console.log("files", files)
          }}
        />
      )}
      {/* VIDEO */}
      {(type === "VIDEO") && (
        <FileUpload inputId={`post.blocks.${index}`} selectedFiles={medias}
          accept="video/*,application/pdf"
          maxSizeMB={10}
          onChange={(files) => {
            setValue(`post.blocks.${index}.media`, files, { shouldDirty: true })
            console.log("files", files)
          }}
        />
      )}

      <Button
        className="absolute right-5 top-5 rounded-full border-red-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        type="button"
        variant="outline"
        onClick={() => remove(index)}>
        <Trash2 className="text-red-600" />
      </Button>
    </div>
  )
}


export default PostBlockForm