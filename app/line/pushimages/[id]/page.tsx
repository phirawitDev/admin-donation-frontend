"use client";

import { useParams } from "next/navigation";

export default function PushImagePage() {
  const { id } = useParams();
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
          <div className="card w-full h-[80vh] flex flex-col gap-5 justify-center items-center rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
