import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useGetThreadsQuery } from "@/redux/services/threadApi";
import ProductShopPagination from "@/components/shop/pagination";

const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "lastActivityAt", header: "Last Activity" },
  { accessorKey: "views", header: "Views" },
  { accessorKey: "status", header: "Status" },
];

const StatusBadge = ({ thread }: any) => {
  if (thread.isLocked) return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 font-medium">Locked</span>;
  if (thread.isPinned) return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-medium">Pinned</span>;
  return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 font-medium">Open</span>;
};

const SkeletonRow = ({ columns }: any) => (
  <TableRow>
    {columns.map((_, i) => (
      <TableCell key={i}>
        <div className="h-4 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      </TableCell>
    ))}
  </TableRow>
);

const Threads = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const { data, isLoading, isFetching } = useGetThreadsQuery({ page, limit });
  const threads = data?.data?.threads ?? [];
  const totalPages = data?.data?.pagination?.totalPages ?? 0;

  const handleRowClick = (threadId: string) => navigate(`/threads/thread/${threadId}`);

  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-y-2 sm:p-4 w-full">
        <div className="overflow-hidden rounded-lg border shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[50%] py-3 px-4 font-medium text-gray-700">Title</TableHead>
                <TableHead className="text-center py-3 px-4 font-medium text-gray-700">Last Activity</TableHead>
                <TableHead className="text-center py-3 px-4 font-medium text-gray-700">Views</TableHead>
                <TableHead className="text-center py-3 px-4 font-medium text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetching && threads.length === 0
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} columns={columns} />)
                : threads.length > 0
                ? threads.map((thread) => (
                    <TableRow
                      key={thread.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      onClick={() => handleRowClick(thread.id)}
                    >
                      <TableCell className="py-3 px-4 font-medium text-blue-600 hover:underline">
                        {thread.title}
                      </TableCell>
                      <TableCell className="text-center py-3 px-4 text-gray-700">
                        {thread.lastActivityAt
                          ? formatDistanceToNow(new Date(thread.lastActivityAt), { addSuffix: true })
                          : formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-center py-3 px-4 text-gray-700">{thread.views}</TableCell>
                      <TableCell className="text-center py-3 px-4">
                        <StatusBadge thread={thread} />
                      </TableCell>
                    </TableRow>
                  ))
                : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-12 text-center text-gray-500">
                      <span className="text-lg">No threads found 😕</span>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="py-6 px-2">
          <ProductShopPagination
            page={page}
            limit={limit}
            total={totalPages}
            setPage={setPage}
            setLimit={setLimit}
          />
        </div>
      </div>
    </div>
  );
};

export default Threads;