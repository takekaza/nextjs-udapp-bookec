import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { metadata } from "../../layout";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 購入API
export async function POST(request: Request, response: Response) {
  const { title, price, bookId, userId } = await request.json();
  console.log("[debug] request:", request);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // bookId userIdを付与する必要がある（渡す）
      metadata: {
        bookId: bookId,
      },
      // user情報は専用のIDにぶち込む
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: title,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // CHECKOUT_SESSION_IDはStripe側で自動生成
      // 本当はprocess.envで取得したい
      success_url:
        "http://localhost:3000/book/checkout-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000",
    });
    return NextResponse.json({ checkout_url: session.url });
  } catch (err: any) {
    return NextResponse.json(err.message);
  }
}
