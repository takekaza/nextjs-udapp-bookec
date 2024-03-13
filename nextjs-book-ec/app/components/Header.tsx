// "use client";
// => use client状態だとasync awaitは使えない

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
import { User } from "../types/types";

const Header = async () => {
  // こっちはCS
  // const { data: session } = useSession();
  // const user = session?.user;
  // こっちはSSR
  // SSRでユーザー情報を取得
  // いろんなページで使う場合はuseContextやReduxでストア管理もありかも
  const session = await getServerSession(nextAuthOptions);
  // anyで退避（TypeScript定義がない場合=> 作ってもいい）
  const user = session?.user as User; // 型キャスト: 存在する時だけ

  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-bold">
          Book EC Site
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホーム
          </Link>
          <Link
            // href={user ? "/profile" : "/login"}
            href={user ? "/profile" : "/api/auth/signin"} // NextAuthのデフォログイン画面
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {user ? "プロフィール" : "ログイン"}
          </Link>

          {user ? (
            // <button
            //   // ここの関数がCSRになっておりSSRにするとエラー
            //   // TODO：修正必要 => onClickを使わずにやると「Link属性でやる」
            //   // onClick={() => signOut({ callbackUrl: "/login" })}
            //   className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            // >
            //   ログアウト
            // </button>
            <Link
              // ここの関数がCSRになっておりSSRにするとエラー
              // TODO：修正必要 => onClickを使わずにやると「Link属性でやる」
              // onClick={() => signOut({ callbackUrl: "/login" })}
              href={"/api/auth/signout"} // NextAuthデフォで用意してくれている
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              ログアウト
            </Link>
          ) : (
            ""
          )}

          <Link href={`/profile`}>
            <Image
              width={50}
              height={50}
              alt="profile_icon"
              src={user?.image || "/default_icon.png"}
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
