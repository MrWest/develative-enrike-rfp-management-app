"use client";

import { useSearchParams } from "wouter";

const useQueryParams = () => {
  const [searchParams] = useSearchParams();

  return searchParams;
};

export default useQueryParams;
