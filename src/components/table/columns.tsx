"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { S3Object } from "@/server/getS3Objects";
//import { GetUserById } from "@/server/getUserById";
/*
async function getUserName(id: number): Promise<string | undefined> {
  let user = await GetUserById();
  return user?.email;
}*/

export const columns: ColumnDef<S3Object>[] = [
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
    /*   cell: async ({ row }) => {
      let userName = await getUserName(row.original.id);
      return <div>{userName}</div>;
    },*/
  },
];
