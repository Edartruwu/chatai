"use client";

import { useState, useEffect } from "react";
import { useColumns } from "./columns";
import { DataTable } from "./data-table";
import { getS3Objects, S3Object, S3Response } from "@/server/getS3Objects";
import { deleteObject } from "@/server/deleteS3Object";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

const PAGE_SIZE = 8;

export default function S3ObjectsTable() {
  const [data, setData] = useState<S3Object[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const t = useTranslations("s3Table");
  const columns = useColumns();

  useEffect(
    function () {
      fetchData();
    },
    [pageIndex],
  );

  function fetchData() {
    setIsLoading(true);
    setError(null);

    getS3Objects(pageIndex + 1, PAGE_SIZE)
      .then((response: S3Response | null) => {
        if (response) {
          setData(response.Data);
          setPageCount(Math.ceil(response.Total / PAGE_SIZE));
        } else {
          setError(t("noData"));
        }
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(t("fetchFailed"));
        setIsLoading(false);
        console.error("Error fetching S3 objects:", err);
      });
  }

  async function handleDelete(ids: number[]): Promise<void> {
    try {
      await Promise.all(ids.map((id) => deleteObject(id)));
      toast({ title: t("deleteSuccess") });
    } catch (error) {
      console.error("Error deleting objects:", error);
      toast({ title: t("deleteFailed") });
    } finally {
      fetchData();
    }
  }

  function handlePageChange(newPage: number) {
    setPageIndex(newPage);
  }

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (error) {
    return <div>{t("error", { error })}</div>;
  }

  return (
    <div className="">
      <DataTable
        width={1000}
        columns={columns}
        data={data}
        onDeleteAction={handleDelete}
        pageCount={pageCount}
        pageSize={PAGE_SIZE}
        pageIndex={pageIndex}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
