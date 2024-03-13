import Image from "next/image";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
import { BookType, Purchase, User } from "../types/types";
import { getDetailBook } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";

export default async function ProfilePage() {
  // SSRでユーザー情報を取得
  // いろんなページで使う場合はuseContextやReduxでストア管理もありかも
  const session = await getServerSession(nextAuthOptions);
  // anyで退避（TypeScript定義がない場合=> 作ってもいい）
  const user = session?.user as User; // 型キャスト: 存在する時だけ

  // 空配列で初期化
  let purchasesDetailBooks: BookType[] = [];

  // 購入履歴検索API叩く
  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-cache" } // SSR：これがデフォ
      // { cache: "force-cache" } // SSGしたい場合
      // CSR：useEffectだと初回読み込みが遅くなる
    );

    // 本の情報が欲しい => bookIdを1つ1つ取り出し詳細情報取得APIへ引数で渡してあげる
    // レスポンスを受け取る
    const purchasesData = await response.json();
    console.log("[debug] purchasesData", purchasesData);
    // => bookIdを1つ1つ取り出し詳細情報取得APIへ引数で渡してあげる
    // なぜPromise.all：全て完了するまで処理
    purchasesDetailBooks = await Promise.all(
      purchasesData.map(async (purchase: Purchase) => {
        // purchasesDetailBooksへ配列として全て返す
        return await getDetailBook(purchase.bookId);
      })
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex items-center gap-6">
        {purchasesDetailBooks.map((purchaseDetailBook: BookType) => (
          // purchaseDetailBook自体の情報を渡す
          <PurchaseDetailBook
            key={purchaseDetailBook.id}
            purchaseDetailBook={purchaseDetailBook}
          />
        ))}
        {/* {purchasesDetailBooks.map((purchaseDetailBook: BookType) => {
          <PurchaseDetailBook key={purchaseDetailBook.id} />;
        })} */}
      </div>
    </div>
  );
}
