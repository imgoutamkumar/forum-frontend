import { Button } from "@/components/ui/button"
import FileUpload from "@/customComponent/fileupload"
import { CustomSelect } from "@/customComponent/select"
import { CustomTextarea } from "@/customComponent/textarea"
import { Trash2, X } from "lucide-react"
import { useEffect } from "react"
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
    defaultValue: {
      existing: [],
      new: []
    }
  })

  useEffect(() => {
    console.log("medias", medias)
    if (type === "TEXT") {
      setValue(`post.blocks.${index}.media`, {
        existing: [],
        new: []
      })
    }
  }, [type, index, setValue])

  return (
    <div className="relative rounded-2xl border border-gray-300 p-2 sm:p-4 mb-2">
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
        <CustomTextarea control={control} name={`post.blocks.${index}.content`} label="Title" height="150px" />

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
        <FileUpload inputId={`post.blocks.${index}`} selectedFiles={medias?.new || []}
          onChange={(files) => {
            setValue(`post.blocks.${index}.media.new`, files, { shouldDirty: true })
            console.log("files", files)
          }}
        />
      )}
      {/* VIDEO */}
      {(type === "VIDEO") && (
        <FileUpload inputId={`post.blocks.${index}`} selectedFiles={medias?.new || []}
          accept="video/*"
          maxSizeMB={10}
          onChange={(files) => {
            setValue(`post.blocks.${index}.media.new`, files, { shouldDirty: true })
            console.log("files", files)
          }}
        />
      )}

      {/* show existing media while updating */}
      {medias?.existing?.length > 0 && (
        <div className="flex flex-wrap gap-2 m-2">
          {medias?.existing?.map((item: any, i: number) => (
            <div key={i} className="relative flex flex-wrap">
              {type === "VIDEO" ? (
                <video
                  src={item?.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-w-32 h-22 object-cover rounded hover:opacity-45"
                />
              ) : (
                <img
                  src={item?.url}
                  className="w-full max-w-32 h-22 object-cover rounded hover:opacity-45"
                />
              )}

              <button
                type="button"
                className="absolute top-[0.1rem] right-[0.1rem] cursor-pointer bg-black/60 hover:bg-black text-white rounded-full size-4 text-xs flex justify-center items-center"
                onClick={() => {
                  const updated = medias?.existing?.filter((_: any, idx: number) => idx !== i)
                  setValue(`post.blocks.${index}.media.existing`, updated, {
                    shouldDirty: true,
                  })
                }}
              >
                <X />
              </button>
            </div>
          ))}
        </div>
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