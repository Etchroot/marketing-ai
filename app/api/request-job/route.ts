import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const WEBHOOK_TOKEN = process.env.N8N_WEBHOOK_TOKEN;

export async function POST(request: NextRequest) {
  if (!WEBHOOK_URL) {
    return NextResponse.json(
      { message: "N8N_WEBHOOK_URL is not configured." },
      { status: 500 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(WEBHOOK_TOKEN ? { Authorization: `Bearer ${WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const contentType = webhookResponse.headers.get("content-type") ?? "";
    const upstreamData = contentType.includes("application/json")
      ? await webhookResponse.json()
      : await webhookResponse.text();

    if (!webhookResponse.ok) {
      return NextResponse.json(
        {
          message: "Failed to call n8n webhook.",
          upstreamStatus: webhookResponse.status,
          upstreamData,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      upstreamStatus: webhookResponse.status,
      upstreamData,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to connect to n8n webhook." },
      { status: 502 },
    );
  }
}
