import { BookType } from "@/app/types/types";
import { createClient } from "microcms-js-sdk";

// API取得用のクライアントを作成
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

export const getAllBooks = async () => {
  const allBooks = await client.getList<BookType>({
    endpoint: "ebook",
  });
  return allBooks;
};

/*
  ここはSSRらしい（サーバーサイドレンダリング）
  fetchが呼ばれているとか
*/
export const getDetailBook = async (contentId: string) => {
  const detailBook = await client.getListDetail<BookType>({
    endpoint: "ebook",
    contentId,
  });

  return detailBook;
};
