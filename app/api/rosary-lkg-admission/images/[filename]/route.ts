import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const STORAGE_DIR = path.join(
  process.cwd(),
  "storage",
  "rosary-lkg-admissions"
);

const IMAGE_FILENAME = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.jpg$/i;

export async function GET(
  _request: Request,
  context: RouteContext<
    "/api/rosary-lkg-admission/images/[filename]"
  >
) {
  const { filename } = await context.params;

  if (!IMAGE_FILENAME.test(filename)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const image = await readFile(path.join(STORAGE_DIR, filename));

    return new NextResponse(image, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": "image/jpeg",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
