import { z } from "zod";
import { serverGET } from "./requests";

const S3ObjectSchema = z.object({
  id: z.number(),
  filename: z.string(),
  s3_key: z.string(),
  user_id: z.string(),
});

const S3ResponseSchema = z.object({
  Data: z.array(S3ObjectSchema),
  PageNumber: z.number(),
  PageSize: z.number(),
  Total: z.number(),
});

export type S3Object = z.infer<typeof S3ObjectSchema>;
export type S3Response = z.infer<typeof S3ResponseSchema>;

export async function getS3Objects(
  page: number,
  pageSize: number,
): Promise<S3Response | null> {
  const endpoint = `/objects?page=${page}&pageSize=${pageSize}`;

  try {
    const response = await serverGET<S3Response>(endpoint);
    console.info(response);
    return S3ResponseSchema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn("Schema validation failed:", error.errors);
      return null;
    }

    console.error("Error fetching S3 objects:", error);
    throw error;
  }
}
