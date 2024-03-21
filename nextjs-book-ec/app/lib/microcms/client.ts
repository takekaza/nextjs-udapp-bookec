import { BookType } from "@/app/types/types";
import { createClient } from "microcms-js-sdk";

// API取得用のクライアントを作成
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

/*
  どういうFetchがベターか
  SSRで
*/
export const getAllBooks = async () => {
  const allBooks = await client.getList<BookType>({
    endpoint: "ebook",
    customRequestInit: {
      // SSR?: キャッシュをせず常に新しいデータ
      // cache: "no-store",
      // ISR
      next: {
        revalidate: 3600, // 1h
      },
    },
  });
  return allBooks;
};

/*
  ここはSSRらしい（サーバーサイドレンダリング）=> fetchが呼ばれているとか
  => デフォではなさそうなので、no-storeを入れる
*/
export const getDetailBook = async (contentId: string) => {
  const detailBook = await client.getListDetail<BookType>({
    endpoint: "ebook",
    contentId,
    customRequestInit: {
      cache: "no-store", // SSR?: キャッシュをせず常に新しいデータ
    },
  });

  return detailBook;
};
