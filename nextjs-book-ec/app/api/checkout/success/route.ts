import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 購入履歴の保存API
export async function POST(request: Request, response: Response) {
  // APIを叩くときにsession_idも受け取りたい
  const { sessionId } = await request.json();
  try {
    // sessionを取り出す
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 重複チェックで購入履歴を探す
    // FindFirstでWhere句
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: session.client_reference_id!,
        bookId: session.metadata?.bookId!,
      },
    });

    if (!existingPurchase) {
      const purchase = await prisma.purchase.create({
        data: {
          userId: session.client_reference_id!,
          bookId: session.metadata?.bookId!,
        },
      });
      return NextResponse.json({ purchase });
    } else {
      return NextResponse.json({ message: "すでに購入済みです。" });
    }
  } catch (err: any) {
    return NextResponse.json(err);
  }
}
