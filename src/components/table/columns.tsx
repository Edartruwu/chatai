"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export type S3objects = {
  id: number;
  filename: string;
  s3_key: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

export const columns: ColumnDef<S3objects>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "filename",
    header: "Filename",
  },
  {
    accessorKey: "s3_key",
    header: "S3 Key",
  },
  {
    accessorKey: "user_id",
    header: "Subido por:",
  },
  {
    accessorKey: "created_at",
    header: "Subido el",
    cell: (info) => {
      const date = info.getValue() as Date;
      return date.toLocaleDateString();
    },
  },
];
