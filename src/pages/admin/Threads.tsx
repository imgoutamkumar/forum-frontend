import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
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
  const context = useOutletContext() || {};
const { search = "" } = context;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { data, isLoading, isFetching } = useGetThreadsQuery({ page, limit, search: debouncedSearch });
  const threads = data?.data?.threads ?? [];
  const totalPages = data?.data?.pagination?.totalPages ?? 0;

  const handleRowClick = (thread: any) => {
    navigate(`/threads/thread/${thread.id}`, {
      state: { title: thread.title },
    });
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-y-2 sm:p-4 w-full">
        <div className="mb-2 sm:mb-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
          <span className="text-xl">⚠️</span>
          <div className="text-sm text-amber-800">
            <p className="font-medium">Community Guidelines Reminder</p>
            <p>
              Please do not post violent, abusive, or inappropriate content.
              Violations may result in removal or account suspension.
            </p>
          </div>
        </div>
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
                      onClick={() => handleRowClick(thread)}
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