"use client";

import { getAuthHeaders } from "@/app/component/Headers";
import { campaignsInterface } from "@/app/interface/campaignsInterface";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDonate, FaPlus } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { RiFileList2Fill } from "react-icons/ri";
import { topicInterface } from "@/app/interface/topicInterface";
import Swal from "sweetalert2";

export default function BlankPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<campaignsInterface[] | null>();
  const [topic, setTopic] = useState<topicInterface | null>();
  const [form, setForm] = useState({
    id: 0,
    name: "",
    details: "",
    price: 0,
    stock: 0,
    formDetails: "fullName",
    formWish: false,
    topicId: 0,
    status: "",
  });
  const [image, setImage] = useState<File | null>();

  const fetchCampaigns = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/campaigns/list/close";
    const headers = getAuthHeaders();

    const campaigns = await axios.get(url, { headers });
    if (campaigns.status == 200) {
      setCampaigns(campaigns.data);
      setIsLoading(false);
    }
  };

  const fetchTopic = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/topic/open";
    const headers = getAuthHeaders();

    const topic = await axios.get(url, { headers });
    if (topic.status == 200) {
      setTopic(topic.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchTopic();
  }, []);

  if (isLoading == true) {
    return (
      <div className="flex w-full h-[80vh] justify-center items-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      details: "",
      price: 0,
      stock: 0,
      formDetails: "fullName",
      formWish: false,
      topicId: 0,
      status: "",
    });
    setImage(null);

    console.log(form);
  };

  const handleCreate = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/campaigns/create";
    const headers = getAuthHeaders();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("details", form.details);
    formData.append("price", form.price.toString());
    formData.append("formDetails", form.formDetails);
    formData.append("formWish", form.formWish.toString());
    formData.append("topicId", form.topicId.toString());
    formData.append("image", image as Blob);

    const campaign = await axios.post(url, formData, { headers });
    if (campaign.status == 200) {
      const modal = document.getElementById(
        "modalCreate"
      ) as HTMLDialogElement | null;
      modal?.close();

      Swal.fire({
        icon: "success",
        title: "เพิ่มข้อมูลสำเร็จ",
        text: "เพิ่มข้อมูลกองบุญสำเร็จ",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      fetchCampaigns();
      resetForm();
    }

    try {
    } catch (error: unknown) {
      const e = error as Error;
      const modal = document.getElementById(
        "modalCreate"
      ) as HTMLDialogElement | null;
      modal?.close();

      return Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: e.message,
        showConfirmButton: true,
        customClass: {
          confirmButton: "btn btn-primary w-20",
        },
        buttonsStyling: false,
      });
    }
  };

  const openUpdateModal = (campaign: campaignsInterface) => {
    setForm({
      id: campaign.id,
      name: campaign.name,
      details: campaign.details,
      price: campaign.price,
      formDetails: campaign.formDetails,
      formWish: campaign.formWish,
      stock: campaign.stock,
      topicId: campaign.topicId,
      status: campaign.status,
    });
    console.log(form);

    const modal = document.getElementById(
      "modalUpdate"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleUpdate = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/campaigns/update";
      const headers = getAuthHeaders();
      const payload = {
        id: form.id,
        name: form.name,
        details: form.details,
        price: form.price,
        formDetails: form.formDetails,
        formWish: form.formWish,
        stock: form.stock,
        topicId: form.topicId,
        status: form.status,
      };

      const update = await axios.put(url, payload, { headers });
      if (update.status == 200) {
        const modal = document.getElementById(
          "modalUpdate"
        ) as HTMLDialogElement | null;
        modal?.close();

        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลสำเร็จ",
          text: "แก้ไขข้อมูลกองบุญสำเร็จ",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        fetchCampaigns();
        resetForm();
      }
    } catch (error: unknown) {
      const e = error as Error;
      const modal = document.getElementById(
        "modalUpdate"
      ) as HTMLDialogElement | null;
      modal?.close();

      return Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: e.message,
        showConfirmButton: true,
        customClass: {
          confirmButton: "btn btn-primary w-20",
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-0 justify-between items-center p-4">
        <h1 className="text-3xl font-bold">จัดการกองบุญ</h1>
        <div className="w-full xl:w-auto flex flex-col xl:flex-row gap-2">
          <Link
            href="/backoffice/admin/campaigns"
            className="btn btn-success w-full xl:w-40"
          >
            <FaDonate /> กองบุญที่เปิดอยู่
          </Link>
          <button
            className="btn btn-primary w-full xl:w-40"
            onClick={() => {
              const modal = document.getElementById(
                "modalCreate"
              ) as HTMLDialogElement | null;
              modal?.showModal();
            }}
          >
            <FaPlus /> เพิ่มกองบุญ
          </button>
        </div>
      </div>
      <div className="hidden xl:flex card w-full p-4 bg-base-100 h-[80vh] overflow-hidden overflow-y-auto">
        <table className="table text-center">
          <thead className="border-b-2 border-base-300">
            <tr>
              <th>รหัสกองบุญ</th>
              <th className="w-[30%]">ชื่อกองบุญ</th>
              <th>ราคา</th>
              <th>จำนวนเปิดรับ</th>
              <th>ยอดร่วมบุญ</th>
              <th>สถานะ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(campaigns) &&
              campaigns.map((campaign: campaignsInterface) => (
                <tr key={campaign.id} className="hover:bg-base-200">
                  <td>{String(campaign.id).padStart(4, "0")}</td>
                  <td className="text-left truncate">{campaign.name}</td>
                  <td>
                    {campaign.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    {campaign.stock > 0
                      ? campaign.stock.toLocaleString("en-US")
                      : 0}
                  </td>
                  <td>
                    {campaign.campaign_transactions
                      .reduce(
                        (sum: number, transaction: { value: number }) =>
                          sum + transaction.value,
                        0
                      )
                      .toLocaleString("en-US")}
                  </td>
                  <td>{campaign.status == "OPEN" ? "เปิดรับ" : "ปิดรับ"}</td>
                  <td className="flex gap-2 justify-center">
                    <Link
                      href={`/backoffice/admin/campaigns/${campaign.id}`}
                      className="text-3xl text-success btn w-14"
                    >
                      <RiFileList2Fill />
                    </Link>
                    <button
                      className="text-3xl text-warning btn w-14"
                      onClick={() => openUpdateModal(campaign)}
                    >
                      <MdEditDocument />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="modal">
        <dialog id="modalCreate" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">เพิ่มกองบุญ</h3>
            <div className="border-b-2 border-base-300 mt-2"></div>

            <div className="mt-6 w-full flex flex-col gap-2">
              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-40">หัวข้อกองบุญ:</p>
                <select
                  className="select w-full"
                  onChange={(e) =>
                    setForm({ ...form, topicId: parseInt(e.target.value) })
                  }
                  value={form.topicId}
                >
                  <option value={0}>เลือกหัวข้อกองบุญ</option>
                  {Array.isArray(topic) &&
                    topic.map((topic: topicInterface) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-40">ชื่อกองบุญ:</p>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="กรอกชื่อกองบุญ"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  value={form.name}
                />
              </div>
              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-40">รายละเอียด:</p>
                <textarea
                  className="textarea w-full"
                  placeholder="กรอกรายละเอียดกองบุญ"
                  onChange={(e) =>
                    setForm({ ...form, details: e.target.value })
                  }
                  value={form.details}
                ></textarea>
              </div>
              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-40">ราคา:</p>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="กรอกราคากองบุญ"
                  onChange={(e) =>
                    setForm({ ...form, price: parseInt(e.target.value) })
                  }
                  value={form.price ?? 0}
                />
              </div>

              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-40">ข้อมูลที่ต้องกรอก:</p>
                <select
                  className="select w-full"
                  onChange={(e) =>
                    setForm({ ...form, formDetails: e.target.value })
                  }
                  value={form.formDetails}
                >
                  <option value={"fullName"}>ชื่อ - สกุล</option>
                  <option value={"fullName_BirthDay"}>
                    ชื่อวันเดือนปีเกิด
                  </option>
                  <option value={"many_Names"}>หลายชื่อ</option>
                </select>
              </div>
              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-40">คำขอพร:</p>
                <select
                  className="select w-full"
                  onChange={(e) =>
                    setForm({ ...form, formWish: e.target.value === "true" })
                  }
                  value={form.formWish == true ? "true" : "false"}
                >
                  <option value={"false"}>ไม่ต้องกรอก</option>
                  <option value={"true"}>ต้องกรอก</option>
                </select>
              </div>
              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-40">รูปกองบุญ:</p>
                <input
                  type="file"
                  className="file-input w-full"
                  onChange={(e) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            </div>

            <div className="modal-action flex gap-2">
              <button className="btn btn-primary w-16" onClick={handleCreate}>
                บันทึก
              </button>
              <form method="dialog">
                <button className="btn w-16">ออก</button>
              </form>
            </div>
          </div>
        </dialog>

        <dialog id="modalUpdate" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">แก้ไขข้อมูลกองบุญ</h3>
            <div className="border-b-2 border-base-300 mt-2"></div>

            <div className="mt-6 w-full flex flex-col gap-2">
              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-40">สถานะกองบุญ:</p>
                <select
                  className="select w-full"
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  value={form.status}
                >
                  <option value={"OPEN"}>เปิดรับกองบุญ</option>
                  <option value={"CLOSE"}>ปิดรับกองบุญ</option>
                </select>
              </div>
            </div>

            <div className="modal-action flex gap-2">
              <button className="btn btn-primary w-16" onClick={handleUpdate}>
                บันทึก
              </button>
              <form method="dialog">
                <button className="btn w-16" onClick={resetForm}>
                  ออก
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}
