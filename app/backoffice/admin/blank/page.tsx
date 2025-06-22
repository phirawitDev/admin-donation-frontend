"use client";

import { useEffect, useState } from "react";

export default function BlankPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading == true) {
    return (
      <div className="flex w-full h-[80vh] justify-center items-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-0 justify-between items-center p-4">
        <h1 className="text-3xl font-bold">จัดการพนักงาน</h1>
        <div className="w-full xl:w-auto">
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              const modal = document.getElementById(
                "modalUserCreate"
              ) as HTMLDialogElement | null;
              modal?.showModal();
            }}
          >
            เพิ่มพนักงาน
          </button>
        </div>
      </div>
    </div>
  );
}
