"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function CampaignPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    content: "",
  });
  const [images, setImages] = useState<File[] | null>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "กำลังดำเนินการ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        width: "375px",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("content", form.content);
      if (images) {
        for (const imageFile of images) {
          formData.append("images", imageFile);
        }
      }
      const url = process.env.NEXT_PUBLIC_API_URL + "/n8n/postcontent";
      const campaign = await axios.post(url, formData, {
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_JWT_SECRET_KEY,
        },
      });

      if (campaign.data.status == 200) {
        Swal.fire({
          title: "เปิดกองบุญสำเร็จ",
          text: "เปิดกองบุญสำเร็จแล้ว",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        });

        router.push("/postcontent");
      }
    } catch (error: unknown) {
      const e = error as Error;
      alert(e.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // แปลง FileList ที่ได้มาให้เป็น Array แล้วเก็บใน State
      setImages(Array.from(e.target.files));
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
        <div className=" w-full overflow-hidden my-16 p-4 flex flex-col gap-2">
          <div className="card flex flex-col w-full h-[85vh] py-4 px-2 items-center bg-white/70 rounded-lg">
            <div className="w-full h-full flex flex-col gap-2 overflow-hidden overflow-y-auto">
              <h1 className="text-2xl text-center">
                กรอกข้อมูลเพื่อโพสต์ทั่วไป
              </h1>
              <form
                id="form"
                onSubmit={handleCreate}
                className="mt-6 flex flex-col gap-3"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="content" className="text-xl">
                    รายละเอียด
                  </label>
                  <textarea
                    name="content"
                    placeholder="กรอกรายละเอียด....."
                    value={form.content}
                    onChange={handleChange}
                    rows={12}
                    required
                    className="textarea w-full text-lg"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xl">รูปภาพ</label>
                  <div className="flex gap-2 items-center justify-between">
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input h-14 w-full"
                      onChange={handleFileChange}
                      required
                      multiple
                    />
                    <button
                      className="btn btn-error h-14 text-xs"
                      onClick={() => setImages(null)}
                    >
                      รีเซ็ตรูปภาพ
                    </button>
                  </div>
                </div>
                <div className="flex w-full mt-6 justify-center items-end">
                  <button form="form" className="btn btn-primary w-40 ">
                    โพสต์
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
