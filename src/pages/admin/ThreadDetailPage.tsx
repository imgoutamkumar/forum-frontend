
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ProductShopPagination from "@/components/shop/pagination"
import { useGetThreadPostsQuery } from "@/redux/services/postApi"
import PostCard from "@/components/shop/thread/PostCardComponent"
import { Button } from "@/components/ui/button"

const ThreadDetailPage = () => {
  const navigate = useNavigate()
  const params = useParams()
  const threadId = params?.threadId as string

  // const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, isLoading, isFetching } = useGetThreadPostsQuery({
    threadId,
    page,
    limit: 10,
  })

  if (!data && isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 p-2 sm:p-4 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-[200px]"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Thread Posts</h1>
      <div className="flex justify-end">
        <Button
          className="cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading || isFetching}
          type="button"
          onClick={() => navigate({ pathname: `/admin/thread/new-post/${threadId}` })}
        >
          {isFetching ? "Refreshing..." : "+ Add post"}
        </Button>
      </div>
      {data?.data?.posts?.map((post) => (
        <>
          <PostCard key={post?.id} post={post} threadId={threadId} />
        </>
      ))}

      {isFetching && data && (
        <div className="text-center text-gray-500 animate-pulse">
          Loading new posts...
        </div>
      )}

      {/* Pagination Controls */}
      <div className="py-6 px-2">
        <ProductShopPagination page={page}
          limit={limit}
          total={data?.data?.pagination?.total || 0}
          setPage={setPage}
          setLimit={setLimit} />
      </div>

    </div>
  )
}

export default ThreadDetailPage