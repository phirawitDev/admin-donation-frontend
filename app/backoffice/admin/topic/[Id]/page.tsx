"use client";

export default function TopicDetailsPage() {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-0 justify-between items-center p-4">
        <h1 className="text-3xl font-bold">กองบุญงาน: </h1>
      </div>
      <div className="hidden xl:flex card w-full p-4 bg-base-100 h-[80vh] overflow-hidden overflow-y-auto">
        <table className="table text-center">
          <thead className="border-b-2 border-base-300">
            <tr>
              <th>รหัสกองบุญ</th>
              <th className="w-[40%]">ชื่อกองบุญ</th>
              <th>ราคา</th>
              <th>ยอดร่วมบุญ</th>
              <th>ยอดรวมรายได้</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}
