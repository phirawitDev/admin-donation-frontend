"use client";

import { getAuthHeaders } from "@/app/component/Headers";
import { topicInterface } from "@/app/interface/topicInterface";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { RiFileList2Fill } from "react-icons/ri";
import Swal from "sweetalert2";

export default function BlankPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [topic, setTopic] = useState<topicInterface | null>();
  const [form, setForm] = useState({
    id: 0,
    name: "",
    status: true,
  });

  const fetchTopic = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/topic/list";
    const headers = getAuthHeaders();

    const topic = await axios.get(url, { headers });
    if (topic.status == 200) {
      setTopic(topic.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, []);

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      status: true,
    });
  };

  if (isLoading == true) {
    return (
      <div className="flex w-full h-[80vh] justify-center items-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/topic/create";
      const headers = getAuthHeaders();

      const create = await axios.post(url, form, { headers });

      if (create.status == 200) {
        const modal = document.getElementById(
          "modalCreate"
        ) as HTMLDialogElement | null;
        modal?.close();

        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลสำเร็จ",
          text: "เพิ่มข้อมูลหัวข้อกองบุญสำเร็จ",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchTopic();
        resetForm();
      }
    } catch (error: unknown) {
      const modal = document.getElementById(
        "modalCreate"
      ) as HTMLDialogElement | null;
      modal?.close();

      const e = error as Error;
      return Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: e.message,
        showConfirmButton: true,
        customClass: {
          confirmButton: "btn btn-primary w-20 mr-2",
        },
        buttonsStyling: false,
      });
    }
  };

  const openUpdateModal = (topic: topicInterface) => {
    setForm({
      id: topic.id,
      name: topic.name,
      status: topic.status ? true : false,
    });

    const modal = document.getElementById(
      "modalUpdate"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/topic/update";
      const headers = getAuthHeaders();

      const update = await axios.put(url, form, { headers });

      if (update.status == 200) {
        const modal = document.getElementById(
          "modalUpdate"
        ) as HTMLDialogElement | null;
        modal?.close();

        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลสำเร็จ",
          text: "แก้ไขข้อมูลหัวข้อกองบุญสำเร็จ",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchTopic();
        resetForm();
      }
    } catch (error: unknown) {
      const modal = document.getElementById(
        "modalUpdate"
      ) as HTMLDialogElement | null;
      modal?.close();

      const e = error as Error;
      return Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: e.message,
        showConfirmButton: true,
        customClass: {
          confirmButton: "btn btn-primary w-20 mr-2",
        },
        buttonsStyling: false,
      });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "คุณต้องการลบใช่หรือไม่?",
      text: "หากยืนยันแล้วจะไม่สามารถกู้คืนข้อมูลได้",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      customClass: {
        confirmButton: "btn btn-primary w-20 mr-2",
        cancelButton: "btn w-20",
      },
      buttonsStyling: false,
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    });
    try {
      if (result.isConfirmed) {
        const url = process.env.NEXT_PUBLIC_API_URL + `/topic/delete/${id}`;
        const headers = getAuthHeaders();

        const deleteData = await axios.delete(url, { headers });

        if (deleteData.status == 200) {
          Swal.fire({
            icon: "success",
            title: "ลบข้อมูลสำเร็จ",
            text: "ลบข้อมูลหัวข้อกองบุญสำเร็จ",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          fetchTopic();
        }
      }
    } catch (error: unknown) {
      const e = error as Error;
      return Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: e.message,
        showConfirmButton: true,
        customClass: {
          confirmButton: "btn btn-primary w-20 mr-2",
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-0 justify-between items-center p-4">
        <h1 className="text-3xl font-bold">จัดการหัวข้อกองบุญ</h1>
        <div className="w-full xl:w-auto">
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              const modal = document.getElementById(
                "modalCreate"
              ) as HTMLDialogElement | null;
              modal?.showModal();
            }}
          >
            <FaPlus /> เพิ่มหัวข้อกองบุญ
          </button>
        </div>
      </div>
      <div className="hidden xl:flex card w-full p-4 bg-base-100">
        <table className="table text-center">
          <thead className="border-b-2 border-base-300">
            <tr>
              <th>รหัสงาน</th>
              <th className="w-[40%]">ชื่องาน</th>
              <th>จำนวนกองบุญ</th>
              <th>ยอดรวมรายได้</th>
              <th>สถานะ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(topic) &&
              topic.map((topic: topicInterface) => (
                <tr className="hover:bg-base-200" key={topic.id}>
                  <td>{String(topic.id).padStart(3, "0")}</td>
                  <td className="text-left truncate">{topic.name}</td>
                  <td>{topic.campaign.length}</td>
                  <td>
                    {(
                      topic.campaign
                        .flatMap((campaign) => campaign.campaign_transactions)
                        .reduce(
                          (sum: number, transaction: { value: number }) =>
                            sum + transaction.value,
                          0
                        ) *
                      (topic.campaign.length > 0 ? topic.campaign[0].price : 0)
                    ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td>{topic.status ? "อยู่ในช่วงงาน" : "จบงานแล้ว"}</td>
                  <td className="flex gap-2 justify-center">
                    <Link
                      href={`/backoffice/admin/topic/${topic.id}`}
                      className="text-3xl text-success btn w-14"
                    >
                      <RiFileList2Fill />
                    </Link>
                    <button
                      className="text-3xl text-warning btn w-14"
                      onClick={() => openUpdateModal(topic)}
                    >
                      <MdEditDocument />
                    </button>
                    <button
                      className="text-3xl text-error btn w-14"
                      onClick={() => {
                        handleDelete(topic.id);
                      }}
                    >
                      <MdDelete />
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
            <h3 className="font-bold text-lg">เพิ่มหัวข้อกองบุญ</h3>
            <div className="border-b-2 border-base-300 mt-2"></div>
            <form id="formCreate" onSubmit={handleCreate}>
              <div className="mt-6 w-full flex flex-col gap-2">
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">ชื่องาน:</p>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="กรอกชื่องาน"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">สถานะ:</p>
                  <select
                    className="select w-full"
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value === "true" })
                    }
                  >
                    <option value={"true"}>อยู่ในช่วงงาน</option>
                    <option value={"false"}>จบงานแล้ว</option>
                  </select>
                </div>
              </div>
            </form>
            <div className="modal-action flex gap-2">
              <button
                className="btn btn-primary w-16"
                type="submit"
                form="formCreate"
              >
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
            <h3 className="font-bold text-lg">เพิ่มหัวข้อกองบุญ</h3>
            <div className="border-b-2 border-base-300 mt-2"></div>
            <form id="formUpdate" onSubmit={handleUpdate}>
              <div className="mt-6 w-full flex flex-col gap-2">
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">ชื่องาน:</p>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="กรอกชื่องาน"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">สถานะ:</p>
                  <select
                    className="select w-full"
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value === "true" })
                    }
                    value={form.status ? "true" : "false"}
                  >
                    <option value={"true"}>อยู่ในช่วงงาน</option>
                    <option value={"false"}>จบงานแล้ว</option>
                  </select>
                </div>
              </div>
            </form>
            <div className="modal-action flex gap-2">
              <button
                className="btn btn-primary w-16"
                type="submit"
                form="formUpdate"
              >
                บันทึก
              </button>
              <form method="dialog">
                <button className="btn w-16" onClick={() => resetForm()}>
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
