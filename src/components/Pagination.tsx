"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

// Inside Pagination.tsx
const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  pageSize,
  currentPage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const totalPages = Math.ceil(totalCount / pageSize);

  // Calculate visible pages for pagination
  const startPage = Math.max(1, currentPage - 1); // Show 1 pages before current
  const endPage = Math.min(totalPages, currentPage + 1); // Show 1 pages after current

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center mt-8 overflow-x-auto">
      <button
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
      >
        First
      </button>
      {startPage > 1 && <span className="mx-2 text-gray-500">...</span>}
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i,
      ).map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-4 py-2 mx-1 rounded-md ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}
      {endPage < totalPages && <span className="mx-2 text-gray-500">...</span>}
      <button
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
