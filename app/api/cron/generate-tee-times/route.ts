import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/generate-tee-times`,
      {
        method: "POST",
        headers: {
          "x-internal-cron": process.env.CRON_SECRET!,
        },
      },
    );

    const data = await response.json();
    return NextResponse.json({ success: true, result: data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
