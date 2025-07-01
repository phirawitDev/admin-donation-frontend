"use client";

import { campaignsInterface } from "@/app/interface/campaignsInterface";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function CampaignPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    campaign_name: "",
    campaign_details: "",
    campaign_price: "",
    img_url: "",
  });
  const [image, setImage] = useState<File | null>();
  const [campaigns, setCampaigns] = useState<campaignsInterface[] | null>();

  const fetchCampaigns = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/campaigns/campaignpush";
      const campaignsdata = await axios.get(url);

      setCampaigns(campaignsdata.data);
    } catch (error: unknown) {
      const e = error as Error;
      alert(e.message);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
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
      formData.append("campaign_name", form.campaign_name);
      formData.append("campaign_details", form.campaign_details);
      formData.append("campaign_price", form.campaign_price);
      formData.append("image", image as Blob);

      const url =
        process.env.NEXT_PUBLIC_API_N8N + "/webhook/post-push-campaign";
      const campaign = await axios.post(url, formData);

      if (campaign.status == 200) {
        Swal.fire({
          title: "กระทุ้งกองบุญสำเร็จ",
          text: "กระทุ้งกองบุญสำเร็จแล้ว",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        });

        const modal = document.getElementById(
          "modal"
        ) as HTMLDialogElement | null;
        modal?.close();

        router.push("/postcontent");
      }
    } catch (error: unknown) {
      const e = error as Error;
      alert(e.message);
    }
  };

  const openModal = (campaign: campaignsInterface) => {
    setForm({
      campaign_name: campaign.name,
      campaign_details: "",
      campaign_price: campaign.price.toString(),
      img_url: process.env.NEXT_PUBLIC_API_URL + campaign.campaign_img,
    });
    const modal = document.getElementById("modal") as HTMLDialogElement | null;
    modal?.showModal();
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
        <div className=" w-full overflow-hidden overflow-y-auto my-16 p-4 flex flex-col gap-2">
          <div className="card flex flex-col w-full h-[85vh] py-4 px-2 items-center bg-white/70 rounded-lg">
            <div className="w-full h-full flex flex-col gap-2 overflow-hidden overflow-y-auto">
              <h1 className="text-2xl text-center">
                เลือกกองบุญที่ต้องการกระทุ้ง
              </h1>
              <div className="flex flex-col w-full mt-6 gap-2 ">
                {Array.isArray(campaigns) &&
                  campaigns.map((campaign: campaignsInterface) => (
                    <button
                      key={campaign.id}
                      onClick={() => openModal(campaign)}
                      className="card border-2 border-primary p-4 shadow-xl text-left"
                    >
                      <h1 className="w-full truncate">{campaign.name}</h1>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="modal">
          <dialog id="modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">กระทุ้งกองบุญ</h3>
              <div className="border-b-2 border-base-300 mt-2"></div>

              <div className="mt-6 w-full flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="campaign_details" className="text-xl">
                    รายละเอียดสำหรับกระทุ้ง
                  </label>
                  <textarea
                    name="campaign_details"
                    placeholder="กรอกรายละเอียดสำหรับกระทุ้ง"
                    value={form.campaign_details}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="textarea w-full text-lg"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xl">รูปสำหรับกระทุ้ง</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input h-14 w-full"
                    onChange={(e) =>
                      setImage(e.target.files ? e.target.files[0] : null)
                    }
                    required
                  />
                </div>
              </div>

              <div className="modal-action flex gap-2">
                <button className="btn btn-primary w-16" onClick={handleCreate}>
                  กระทุ้ง
                </button>
                <form method="dialog">
                  <button className="btn w-16">ออก</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}
