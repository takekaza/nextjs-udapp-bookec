import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// 購入履歴検索API
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  try {
    //
    const purchase = await prisma.purchase.findMany({
      where: { userId: userId },
    });

    // console.log("[debug] try purchases:", purchase);
    return NextResponse.json(purchase);
  } catch (error) {
    console.log("[debug] error", error);
    return NextResponse.json(error);
    // return new Response(
    //   JSON.stringify({
    //     error: true,
    //     message: "Internal Server Error",
    //     details: String(error),
    //   }),
    //   {
    //     status: 500,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
  }
}
