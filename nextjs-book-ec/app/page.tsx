// "use client";
import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { BookType, Purchase, User } from "@/app/types/types";
import { nextAuthOptions } from "./lib/next-auth/options";
import PurchaseSuccess from "./book/checkout-success/page";

// // 疑似データ
// const books = [
//   {
//     id: 1,
//     title: "Book 1",
//     thumbnail: "/thumbnails/discord-clone-udemy.png",
//     price: 2980,
//     author: {
//       id: 1,
//       name: "Author 1",
//       description: "Author 1 description",
//       profile_icon: "https://source.unsplash.com/random/2",
//     },
//     content: "Content 1",
//     created_at: new Date().toString(),
//     updated_at: new Date().toString(),
//   },
//   {
//     id: 2,
//     title: "Book 2",
//     thumbnail: "/thumbnails/notion-udemy.png",
//     price: 1980,
//     author: {
//       id: 2,
//       name: "Author 2",
//       description: "Author 2 description",
//       profile_icon: "https://source.unsplash.com/random/3",
//     },
//     content: "Content 2",
//     created_at: new Date().toString(),
//     updated_at: new Date().toString(),
//   },
//   {
//     id: 3,
//     title: "Book 3",
//     price: 4980,
//     thumbnail: "/thumbnails/openai-chatapplication-udem.png",
//     author: {
//       id: 3,
//       name: "Author 3",
//       description: "Author 3 description",
//       profile_icon: "https://source.unsplash.com/random/4",
//     },
//     content: "Content 3",
//     created_at: new Date().toString(),
//     updated_at: new Date().toString(),
//   },
//   // 他の本のデータ...
// ];

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  // SSRでユーザー情報を取得
  const session = await getServerSession(nextAuthOptions);
  // console.log("[debug] nextAuthOptions", nextAuthOptions);
  // anyで退避（TypeScript定義がない場合=> 作ってもいい）
  const user = session?.user as User; // 型キャスト: 存在する時だけ

  const { contents } = await getAllBooks();

  // 定義
  let purchaseBookIds: string[];

  // 購入履歴検索API叩く
  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-cache" } // SSR：これがデフォ
      // { cache: "force-cache" } // SSGしたい場合
      // CSR：useEffectだと初回読み込みが遅くなる
    );

    // レスポンスを受け取る
    const purchasesData = await response.json();
    // console.log(purchasesData);

    // bookId取り出し
    purchaseBookIds = purchasesData.map(
      (purchaseBook: Purchase) => purchaseBook.bookId
    );
    // console.log("[debug] purchaseBookIds:", purchaseBookIds);
  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book EC Site
        </h2>
        {contents.map((book: BookType) => (
          <Book
            key={book.id}
            book={book}
            // オプショナルチェイニングでundefined回避
            isPurchased={purchaseBookIds?.includes(book.id)}
          />
          // includes() => 値が含まれているか否か論理値を返す => BookコンポーネントにPropsで渡してあげる
        ))}
      </main>
    </>
  );
}
