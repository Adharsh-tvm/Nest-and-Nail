"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/app/components/ui/Pagination";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function WorkersPagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
