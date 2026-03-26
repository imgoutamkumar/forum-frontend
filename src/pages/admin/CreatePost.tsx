import CreateNewPostForm from '@/components/admin/CreatePostForm/CreatePostForm'
import { useParams } from "react-router-dom"

const CreatePost = () => {
    const { threadId } = useParams()

    return (
        <div>
            <CreateNewPostForm threadId={threadId!} />
        </div>
    )
}

export default CreatePost
