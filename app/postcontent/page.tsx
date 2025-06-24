"use client";

import Link from "next/link";
import { FcAdvertising, FcDonate } from "react-icons/fc";

export default function PostContentPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div
        className="
      w-full max-w-[425px]
      bg-[url('/1.png')] 
        bg-cover 
        bg-bottom 
        bg-no-repeat
        h-screen
    "
      >
        <div className="h-16 w-full max-w-[425px] text-white fixed flex justify-center items-center bg-red-950">
          <h1 className="text-3xl text-center">กวนอิมทุ่งพิชัยออนไลน์</h1>
        </div>
        <div className=" w-full overflow-hidden my-16 p-2 flex flex-col gap-2">
          <div className="card w-full h-[80vh] flex flex-col gap-5 justify-center items-center rounded-lg">
            <Link
              className="flex flex-col items-center justify-center text-center gap-4 w-44 h-44 p-4 rounded-2xl text-2xl bg-white/70"
              href="/postcontent/campaign"
            >
              <FcDonate className="text-5xl text-center" />
              โพสต์กองบุญ
            </Link>
            <Link
              className="flex flex-col items-center justify-center text-center gap-4 w-44 h-44 p-4 rounded-2xl text-2xl bg-white/70"
              href="/postcontent/campaignpush"
            >
              <FcAdvertising className="text-5xl text-center" />
              โพสต์กระทุ้งกองบุญ
            </Link>
            {/* <Link
              className="flex flex-col items-center justify-center text-center gap-4 w-44 h-44 p-4 rounded-2xl text-2xl bg-white/70"
              href="/postcontent/post"
            >
              <FcAdvertising className="text-5xl text-center" />
              โพสต์ทั่วไป
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
