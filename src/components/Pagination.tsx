"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  pageSize,
  currentPage,
}) => {
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (page: number) => {
    router.push(`/?page=${page}`);
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-4 py-2 mx-1 rounded-md ${
          currentPage <= 1
            ? "cursor-not-allowed opacity-50"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        aria-label="Previous Page"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
        page === currentPage ? (
          <span
            key={page}
            className="px-4 py-2 mx-1 rounded-md bg-blue-600 text-white"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className="px-4 py-2 mx-1 rounded-md bg-gray-200 hover:bg-gray-300"
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ),
      )}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 mx-1 rounded-md ${
          currentPage >= totalPages
            ? "cursor-not-allowed opacity-50"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
