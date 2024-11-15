"use client";

import { useState } from "react";
import { columns, S3objects } from "./columns";
import { DataTable } from "./data-table";

const mockData: S3objects[] = [
  {
    id: 1,
    filename: "example1.jpg",
    s3_key: "uploads/example1.jpg",
    user_id: "user1",
    created_at: new Date("2023-05-01"),
    updated_at: new Date("2023-05-01"),
  },
  {
    id: 2,
    filename: "example2.pdf",
    s3_key: "uploads/example2.pdf",
    user_id: "user2",
    created_at: new Date("2023-05-02"),
    updated_at: new Date("2023-05-02"),
  },
  {
    id: 1,
    filename: "report_Q1_2023.pdf",
    s3_key: "documents/reports/report_Q1_2023.pdf",
    user_id: "user_123",
    created_at: new Date("2023-03-01T10:15:30Z"),
    updated_at: new Date("2023-03-01T10:15:30Z"),
  },
  {
    id: 2,
    filename: "invoice_45234.xlsx",
    s3_key: "invoices/2023/invoice_45234.xlsx",
    user_id: "user_456",
    created_at: new Date("2023-04-05T12:00:00Z"),
    updated_at: new Date("2023-04-05T12:00:00Z"),
  },
  {
    id: 3,
    filename: "presentation_final.pptx",
    s3_key: "presentations/2023/presentation_final.pptx",
    user_id: "user_789",
    created_at: new Date("2023-05-15T09:45:20Z"),
    updated_at: new Date("2023-05-16T14:30:10Z"),
  },
  {
    id: 4,
    filename: "data_export.csv",
    s3_key: "exports/data/data_export_2023_06.csv",
    user_id: "user_101",
    created_at: new Date("2023-06-25T15:30:00Z"),
    updated_at: new Date("2023-06-25T15:30:00Z"),
  },
  {
    id: 5,
    filename: "user_guide.pdf",
    s3_key: "manuals/user_guide.pdf",
    user_id: "user_202",
    created_at: new Date("2023-07-12T08:00:00Z"),
    updated_at: new Date("2023-07-12T08:00:00Z"),
  },
];

export default function S3ObjectsTable() {
  const [data, setData] = useState(mockData);

  const handleDelete = (ids: number[]) => {
    // Mock delete action
    console.log(`Deleting objects with ids: ${ids.join(", ")}`);
    // You can implement the actual delete logic here
    setData((prevData) => prevData.filter((item) => !ids.includes(item.id)));
  };

  return (
    <div>
      <DataTable columns={columns} data={data} onDelete={handleDelete} />
    </div>
  );
}
