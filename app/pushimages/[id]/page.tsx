"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import { campaign_transactionsInterface } from "@/app/interface/campaign_transactionsInterface";

interface ImageField {
  id: string;
  file: File | null;
}

export default function PushImagePage() {
  const { id } = useParams();
  const [imageFields, setImageFields] = useState<ImageField[]>([]);
  const [data, setData] = useState<campaign_transactionsInterface | null>();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + `/pushimages/data/${id}`;

      const res = await axios.get(url);
      setData(res.data);
    } catch (error: unknown) {
      const e = error as Error;
      console.log(e.message);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddField = () => {
    if (imageFields.length >= 5) {
      alert("อัปโหลดได้สูงสุด 5 รูปภาพ");
      return;
    }
    setImageFields((prevFields) => [
      ...prevFields,
      {
        id: crypto.randomUUID(),
        file: null,
      },
    ]);
  };

  const handleRemoveField = (idToRemove: string) => {
    // [ง่ายขึ้น] ไม่ต้องจัดการ revokeObjectURL แล้ว
    setImageFields((prevFields) =>
      prevFields.filter((field) => field.id !== idToRemove)
    );
  };

  // [ง่ายขึ้น] 2. ฟังก์ชันนี้ไม่ต้องจัดการกับ preview URL อีกต่อไป
  const handleFileChange = (
    idToUpdate: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFields((prevFields) =>
      prevFields.map((field) =>
        field.id === idToUpdate ? { ...field, file: file } : field
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. กรองเอาเฉพาะช่องที่มีไฟล์ (ส่วนนี้เหมือนเดิม)
    const filesToUpload = imageFields.filter((field) => field.file !== null);
    if (filesToUpload.length === 0) {
      Swal.fire({
        icon: "error",
        title: "ยังไม่ได้เลือกไฟล์",
        text: "กรุณาเลือกไฟล์อย่างน้อย 1 ไฟล์",
      });
      return;
    }

    // [เพิ่ม] ตรวจสอบว่ามีข้อมูล Transaction หรือยัง (เหมือนเดิม)
    if (!data) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่พบข้อมูล Transaction สำหรับอ้างอิง",
      });
      return;
    }

    // เริ่มแสดง Pop-up กำลังโหลด
    Swal.fire({
      title: "กำลังเริ่มต้นอัปโหลด...",
      text: `เตรียมส่ง ${filesToUpload.length} ไฟล์`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      for (const [index, field] of filesToUpload.entries()) {
        Swal.update({
          title: `กำลังอัปโหลดไฟล์ที่ ${index + 1} / ${filesToUpload.length}`,
          text: field.file!.name,
          showConfirmButton: false,
        });

        const formData = new FormData();
        formData.append("image", field.file!);
        formData.append("uid", data.customer.uid);
        formData.append("transactionID", id as string);
        formData.append("commentId", data.customer.commentId as string);

        let url = null;
        if (data.customer.from === "line") {
          url = process.env.NEXT_PUBLIC_API_URL + "/pushimages/line";
        } else if (
          data.customer.from === "facebook" &&
          data.customer.postId !== null &&
          data.customer.commentId !== null
        ) {
          url = process.env.NEXT_PUBLIC_API_URL + "/pushimages/post";
        } else if (
          data.customer.from === "facebook" &&
          data.customer.postId === null &&
          data.customer.commentId === null
        ) {
          url = process.env.NEXT_PUBLIC_API_URL + "/pushimages/inbox";
        }

        if (!url) {
          return;
        }

        const response = await axios.post(url, formData);

        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`การอัปโหลดไฟล์ '${field.file!.name}' ล้มเหลว`);
        }
      }

      Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: `อัปโหลด ${filesToUpload.length} รูปภาพเรียบร้อยแล้ว`,
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      router.push(`/backoffice/admin/campaigns/${data.campaignId}`);
    } catch (error: unknown) {
      const e = error as Error;
      console.log(e);
    }
  };

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
          <div className="card w-full h-[80vh] flex flex-col gap-5 mt-10 rounded-lg">
            <div className="card flex flex-col w-full py-4 px-2 items-center bg-white/70 rounded-lg">
              <h1 className="text-2xl text-center font-bold">
                อัพโหลดภาพส่งลูกบุญ
              </h1>
              <div>
                <Image
                  className="mt-2 w-full"
                  src="/Asset279.png"
                  width={500}
                  height={500}
                  alt="QRCODE"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between w-full text-lg">
                  <p>กองบุญ</p>
                  <p className="truncate">{data?.campaign.name}</p>
                </div>
                <div className="flex justify-between w-full text-lg">
                  <p>จำนวน</p>
                  <p className="truncate">{data?.value}</p>
                </div>
                <div className="flex justify-between w-full text-lg">
                  <p>ชื่อโปรไฟล์</p>
                  <p className="truncate">{data?.customer.displayName}</p>
                </div>
              </div>
              <div>
                <Image
                  className="mt-2 w-full"
                  src="/Asset279.png"
                  width={500}
                  height={500}
                  alt="QRCODE"
                />
              </div>
              <div className="w-full mt-4">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-center gap-4"
                >
                  {/* ส่วนที่แสดงช่องอัปโหลดไฟล์ที่ถูกสร้างขึ้น */}
                  <div className="w-full space-y-3">
                    {imageFields.map((field) => (
                      // 1. โครงสร้างของแต่ละแถว
                      <div
                        key={field.id}
                        className="w-full bg-gray-200 border-2 border-gray-300 rounded-full flex items-center justify-between pl-4 pr-2 py-2"
                      >
                        {/* 2. ใช้ label ครอบข้อความและซ่อน input จริงไว้ */}
                        <label className="flex-grow cursor-pointer overflow-hidden">
                          <span className="text-sm text-gray-700 truncate">
                            {field.file
                              ? field.file.name
                              : "เลือกไฟล์ ไม่ได้เลือกไฟล์ใดใด"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden" // ซ่อน input เริ่มต้นไว้
                            onChange={(e) => handleFileChange(field.id, e)}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          className="ml-2 px-4 py-1 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 flex-shrink-0"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ปุ่มควบคุมหลัก */}
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg"
                  >
                    เพิ่มรูป
                  </button>

                  <button
                    type="submit"
                    disabled={imageFields.length === 0}
                    className="w-full py-3 bg-success text-white font-bold rounded-lg"
                  >
                    ยืนยันส่งภาพกองบุญ
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
