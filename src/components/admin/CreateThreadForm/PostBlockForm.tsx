import { Button } from "@/components/ui/button"
import FileUpload from "@/customComponent/fileupload"
import { CustomSelect } from "@/customComponent/select"
import { CustomTextarea } from "@/customComponent/textarea"
// 👉 Import ArrowUp and ArrowDown
import { Trash2, X, ArrowUp, ArrowDown } from "lucide-react" 
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

const blockTypeOptions = [
  { label: "TEXT", value: "TEXT" },
  { label: "IMAGE", value: "IMAGE" },
  { label: "VIDEO", value: "VIDEO" }
]

// 👉 Accept move and totalBlocks as props
const PostBlockForm = ({ index, remove, move, totalBlocks }) => { 
  const { control, setValue } = useFormContext()

  const type = useWatch({
    control,
    name: `post.blocks.${index}.type`
  })

  const medias = useWatch({
    control,
    name: `post.blocks.${index}.media`,
    defaultValue: { existing: [], new: [] }
  })

  useEffect(() => {
    if (type === "TEXT") {
      setValue(`post.blocks.${index}.media`, { existing: [], new: [] })
    }
  }, [type, index, setValue])

  return (
    <div className="relative rounded-2xl border border-gray-300 p-2 sm:p-4 mb-2 mt-4">
      <h3 className="text-[1rem] font-bold mb-2">Block {index + 1}</h3>
      
      <div className="grid sm:grid-cols-3">
        <CustomSelect control={control} name={`post.blocks.${index}.type`} label="Category ID" options={blockTypeOptions} />
      </div>

      {type === "TEXT" && (
        <CustomTextarea control={control} name={`post.blocks.${index}.content`} label="Content" height="150px" />
      )}

      {type === "IMAGE" && (
        <FileUpload inputId={`post.blocks.${index}`} selectedFiles={medias?.new || []}
          onChange={(files) => {
            setValue(`post.blocks.${index}.media.new`, files, { shouldDirty: true })
          }}
        />
      )}

      {type === "VIDEO" && (
        <FileUpload inputId={`post.blocks.${index}`} selectedFiles={medias?.new || []}
          accept="video/*"
          maxSizeMB={40}
          onChange={(files) => {
            setValue(`post.blocks.${index}.media.new`, files, { shouldDirty: true })
          }}
        />
      )}

      {medias?.existing?.length > 0 && (
        <div className="flex flex-wrap gap-2 m-2">
          {medias?.existing?.map((item: any, i: number) => (
            <div key={i} className="relative flex flex-wrap">
              {type === "VIDEO" ? (
                <video src={item?.url} autoPlay loop muted playsInline className="w-full max-w-32 h-22 object-cover rounded hover:opacity-45" />
              ) : (
                <img src={item?.url} className="w-full max-w-32 h-22 object-cover rounded hover:opacity-45" />
              )}
              <button
                type="button"
                className="absolute top-[0.1rem] right-[0.1rem] cursor-pointer bg-black/60 hover:bg-black text-white rounded-full size-4 text-xs flex justify-center items-center"
                onClick={() => {
                  const updated = medias?.existing?.filter((_: any, idx: number) => idx !== i)
                  setValue(`post.blocks.${index}.media.existing`, updated, { shouldDirty: true })
                }}
              >
                <X />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 👉 Group Action Buttons in the top right */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <Button
          className="rounded-full size-8 p-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          type="button"
          variant="outline"
          disabled={index === 0} // Disable UP if it's the first item
          onClick={() => move(index, index - 1)}>
          <ArrowUp className="size-4" />
        </Button>

        <Button
          className="rounded-full size-8 p-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          type="button"
          variant="outline"
          disabled={index === totalBlocks - 1} // Disable DOWN if it's the last item
          onClick={() => move(index, index + 1)}>
          <ArrowDown className="size-4" />
        </Button>

        <Button
          className="rounded-full size-8 p-0 border-red-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          type="button"
          variant="outline"
          onClick={() => remove(index)}>
          <Trash2 className="text-red-600 size-4" />
        </Button>
      </div>
    </div>
  )
}

export default PostBlockForm