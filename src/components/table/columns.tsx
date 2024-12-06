"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { S3Object } from "@/server/getS3Objects";
import { useTranslations } from "next-intl";

export const useColumns = (): ColumnDef<S3Object>[] => {
  const t = useTranslations("datatable");

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("selectAll")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("selectRow")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "filename",
      header: t("filename"),
    },
    {
      accessorKey: "s3_key",
      header: t("s3Key"),
    },
    {
      accessorKey: "user_email",
      header: t("uploadedBy"),
    },
  ];
};
