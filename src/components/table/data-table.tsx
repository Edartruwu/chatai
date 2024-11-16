"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData extends { id: number }> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  onDeleteAction: (ids: number[]) => void;
  width?: string | number;
  pageCount: number;
  pageSize: number;
  pageIndex: number;
  onPageChange: (newPage: number) => void;
}

export function DataTable<TData extends { id: number }>({
  columns,
  data,
  onDeleteAction,
  width = "100%",
  pageCount,
  pageSize,
  pageIndex,
  onPageChange,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  function handleDeleteSelected() {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map(function (row) {
      return row.original.id;
    });
    onDeleteAction(selectedIds);
  }

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    table.getColumn("filename")?.setFilterValue(event.target.value);
  }

  function handlePreviousPage() {
    if (pageIndex > 0) {
      onPageChange(pageIndex - 1);
    }
  }

  function handleNextPage() {
    if (pageIndex < pageCount - 1) {
      onPageChange(pageIndex + 1);
    }
  }

  return (
    <div style={{ width }} className="max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center py-4 gap-4">
        <Input
          placeholder="Busca por nombre..."
          value={
            (table.getColumn("filename")?.getFilterValue() as string) ?? ""
          }
          onChange={handleFilterChange}
          className="w-full sm:max-w-sm"
        />
        <Button
          onClick={handleDeleteSelected}
          className="w-full sm:w-auto sm:ml-auto"
        >
          Delete Selected
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(function (headerGroup) {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(function (header) {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(function (row) {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map(function (cell) {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={pageIndex === 0}
        >
          previo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={pageIndex === pageCount - 1}
        >
          siguiente
        </Button>
      </div>
    </div>
  );
}
