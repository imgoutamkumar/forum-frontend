/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { getPaginationRange } from "@/helper/commonFunction"

type PaginationProps = {
    page: number
    limit: number
    total: number
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

const ProductShopPagination = ({
    page,
    limit,
    total,
    setPage,
}: PaginationProps) => {
    const totalPages = Math.ceil(total / limit)
    const paginationRange = getPaginationRange(page, totalPages)

    return (
        <Pagination>
            <PaginationContent className="w-full flex items-center justify-center">
                <PaginationItem>
                    <PaginationPrevious
                        className={`
      px-3 py-2 rounded-lg transition-colors duration-200
      ${page === 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            }
    `}
                        onClick={() => page > 1 && setPage(page - 1)} aria-disabled={page === 1} />
                </PaginationItem>
                {/* Page Numbers */}
                {paginationRange.map((item, index) => {
                    if (item === "dots") {
                        return (
                            <PaginationItem key={`dots-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={item}>
                            <PaginationLink
                                className={`
        relative px-4 py-2 mx-1 rounded-xl font-semibold transition-all duration-300 ease-out
        cursor-pointer
        ${item === page ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg scale-110" : "bg-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:text-white hover:scale-105"}
      `}
                                href="#"
                                isActive={item === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(item)
                                }}
                            >
                                {item}
                                {/* Optional “sparkle” effect */}
                                {item === page && (
                                    <span className="absolute -top-2 -right-2 h-2 w-2 bg-yellow-300 rounded-full animate-bounce"></span>
                                )}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        className={`
      px-3 py-2 rounded-lg transition-colors duration-200
      ${page === totalPages
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            }
    `}
                        onClick={() => page < totalPages && setPage(page + 1)} aria-disabled={page === totalPages} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default ProductShopPagination