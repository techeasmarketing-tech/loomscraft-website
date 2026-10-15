import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret)
      return new NextResponse("Missing SANITY_REVALIDATE_SECRET", {
        status: 500,
      });
    const { isValidSignature } = await parseBody(req, secret);
    if (!isValidSignature)
      return new NextResponse("Invalid signature", { status: 401 });
    revalidateTag("sanity");
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
