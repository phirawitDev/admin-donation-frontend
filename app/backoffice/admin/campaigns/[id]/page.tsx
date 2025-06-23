"use client";

import { getAuthHeaders } from "@/app/component/Headers";
import { campaign_transactionsInterface } from "@/app/interface/campaign_transactionsInterface";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FaCamera, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import { FcDataSheet } from "react-icons/fc";
import Image from "next/image";
export default function BlankPage() {
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const id = params.id;
  const [campaignname, setCampaignname] = useState();
  const [transactions, setTransactions] =
    useState<campaign_transactionsInterface | null>();
  const [form, setForm] = useState({
    name: "",
    Wish: "",
    value: 1,
    displayName: "",
    from: "L",
    campaignId: id,
  });

  const fetchTransactions = useCallback(async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + `/transactions/${id}`;
      const headers = getAuthHeaders();

      const transactions = await axios.get(url, { headers });
      if (transactions.status == 200) {
        setTransactions(transactions.data);
        setCampaignname(transactions.data[0]?.campaign.name ?? "");
        setIsLoading(false);
      }
    } catch (error) {
      return error;
    }
  }, [id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (isLoading == true) {
    return (
      <div className="flex w-full h-[80vh] justify-center items-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  const updateFbUser = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_UP_USERS || "";
      const response = await axios.get(url);
      console.log(response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก:", error);
    }
  };

  const openModal = () => {
    updateFbUser();
    const modal = document.getElementById(
      "modalCreate"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const resetForm = () => {
    setForm({
      name: "",
      Wish: "",
      value: 1,
      displayName: "",
      from: "L",
      campaignId: id,
    });
  };

  const HandleSplitName = () => {
    const textElementName = document.getElementById(
      "textareaName"
    ) as HTMLTextAreaElement;
    const textElementWish = document.getElementById(
      "textareaWish"
    ) as HTMLTextAreaElement;

    if (!textElementName || !textElementWish) return;

    const linesName = textElementName.value.split("\n");
    const nonEmptyLinesName = linesName.map((line, index) => {
      return line.trim() !== "" && index < linesName.length - 1
        ? `${line}`
        : line;
    });
    const updatedTextName = nonEmptyLinesName.join("/n/");

    const linesWish = textElementWish.value.split("\n");
    const nonEmptyLinesWish = linesWish.map((line, index) => {
      return line.trim() !== "" && index < linesWish.length - 1
        ? `${line}`
        : line;
    });
    const updatedTextWish = nonEmptyLinesWish.join("/n/");

    setForm((prevForm) => ({
      ...prevForm,
      name: updatedTextName,
      Wish: updatedTextWish,
      value: nonEmptyLinesName.length,
    }));
  };

  // const HandleNoSplitName = () => {
  //   const textElementName = document.getElementById(
  //     "textareaName"
  //   ) as HTMLTextAreaElement;
  //   const textElementWish = document.getElementById(
  //     "textareaWish"
  //   ) as HTMLTextAreaElement;

  //   if (!textElementName || !textElementWish) return;

  //   const linesName = textElementName.value.split("\n");
  //   const nonEmptyLinesName = linesName.map((line, index) => {
  //     return line.trim() !== "" && index < linesName.length - 1
  //       ? `${line}`
  //       : line;
  //   });
  //   const updatedTextName = nonEmptyLinesName.join("/nn/");

  //   const linesWish = textElementWish.value.split("\n");
  //   const nonEmptyLinesWish = linesWish.map((line, index) => {
  //     return line.trim() !== "" && index < linesWish.length - 1
  //       ? `${line}`
  //       : line;
  //   });
  //   const updatedTextWish = nonEmptyLinesWish.join("/nn/");

  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     name: updatedTextName,
  //     Wish: updatedTextWish,
  //     value: nonEmptyLinesName.length,
  //   }));
  // };

  const handleCreate = async () => {
    const modal = document.getElementById(
      "modalCreate"
    ) as HTMLDialogElement | null;
    modal?.close();
    Swal.fire({
      icon: "info",
      title: "กำลังประมวลผล",
      text: "กำลังดำเนินการกรุณารอสักครู่...",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });

    try {
      const formName = form.name.split("/n/");
      const formWish = form.Wish.split("/n/");

      for (let i = 0; i < formName.length; i++) {
        const formData = new FormData();

        const valueToSend = formName.length > 1 ? 1 : form.value;

        formData.append("name", formName[i]);
        formData.append("wish", formWish[i]);
        formData.append("value", valueToSend.toString());
        formData.append("displayName", form.displayName);
        formData.append("from", form.from);
        formData.append("campaignId", form.campaignId as string);

        const url = process.env.NEXT_PUBLIC_API_URL + "/transactions/create";
        const headers = getAuthHeaders();

        await axios.post(url, formData, { headers });
      }

      const modal = document.getElementById(
        "modalCreate"
      ) as HTMLDialogElement | null;
      modal?.close();
      resetForm();
      fetchTransactions();
      return Swal.fire({
        icon: "success",
        title: "เพิ่มข้อมูลสำเร็จ",
        text: "เพิ่มข้อมูลกองบุญสำเร็จ",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
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

  const handleDelete = async (id: number) => {
    try {
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

      if (result.isConfirmed) {
        const url =
          process.env.NEXT_PUBLIC_API_URL + `/transactions/delete/${id}`;
        const headers = getAuthHeaders();

        const deleteData = await axios.delete(url, { headers });

        if (deleteData.data.status == 200) {
          Swal.fire({
            icon: "success",
            title: "ลบข้อมูลสำเร็จ",
            text: "ลบข้อมูลกองบุญสำเร็จ",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          fetchTransactions();
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

  const handleExport = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL + `/excel/campaigns/${id}`;

      console.log(`กำลังเรียก API ที่: ${apiUrl}`);

      const response = await axios.get(apiUrl, {
        responseType: "blob",
      });

      const now = new Date();
      const filename = `${campaignname}-${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}_${now.getHours()}-${now.getMinutes()}.xlsx`;
      saveAs(response.data, filename);
    } catch (error: unknown) {
      const e = error as Error;
      console.error("ดาวน์โหลดไฟล์ไม่สำเร็จ:", e);
    } finally {
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-0 justify-between items-center p-4">
        <h1 className="text-3xl font-bold">กองบุญ: {campaignname}</h1>
        <div className="w-full xl:w-auto flex flex-col xl:flex-row gap-2 mt-2 xl:mt-0">
          <button className="btn xl:w-44" onClick={handleExport}>
            <FcDataSheet className="text-xl" /> โหลดไฟล์ Excel
          </button>
          <Link
            href={`/backoffice/admin/campaigns/complete/${id}`}
            className="btn btn-error xl:w-44"
          >
            ดำเนินการแล้ว
          </Link>
          <button className="btn btn-primary xl:w-44" onClick={openModal}>
            <FaPlus /> เพิ่มรายการร่วมบุญ
          </button>
        </div>
      </div>
      <div className="hidden xl:flex card w-full p-4 bg-base-100">
        <table className="table table-fixed text-center w-full">
          <thead className="border-b-2 border-base-300">
            <tr>
              <th className="w-[10%]">สลิปโอนเงิน</th>
              <th className="w-[20%]">รายนาม</th>
              <th className="w-[20%]">คำขอพร</th>
              <th className="w-[10%]">จำนวน</th>
              <th className="w-[10%]">ชื่อโปรไฟล์</th>
              <th className="w-[10%]">Qr_Url</th>
              <th className="w-[10%]">ที่มา</th>
              <th className="w-[10%]">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transactions) &&
              transactions.map(
                (transaction: campaign_transactionsInterface) => (
                  <tr key={transaction.id} className="hover:bg-base-200">
                    <td className="w-[10%] truncate">
                      <div className="w-full h-20 relative">
                        <Image
                          src={`${
                            process.env.NEXT_PUBLIC_API_URL +
                            transaction.slip_img
                          }`}
                          alt="campaigns"
                          fill
                        />
                      </div>
                    </td>
                    <td className="w-[20%] truncate">
                      {transaction.details !== null && (
                        <p>{transaction.details}</p>
                      )}
                      {transaction.campaign.formDetails === "fullName" && (
                        <p>{transaction.name}</p>
                      )}
                      {transaction.campaign.formDetails ===
                        "fullName_BirthDay" && (
                        <div>
                          <p>{transaction.name}</p>
                          <p>
                            {transaction.birthdate} {transaction.birthmonth}{" "}
                            {transaction.birthyear}
                            {" เวลา "}
                            {transaction.birthtime}
                            {" ปีนักษัตร"}
                            {transaction.birthconstellation}
                            {" อายุ "}
                            {transaction.age}
                            {" ปี"}
                          </p>
                        </div>
                      )}
                      {transaction.campaign.formDetails === "many_Names" && (
                        <div>
                          <p>{transaction.many_names}</p>
                        </div>
                      )}
                    </td>
                    <td className="w-[20%] truncate">{transaction.wish}</td>
                    <td className="w-[10%]">{transaction.value}</td>
                    <td className="w-[10%] truncate">
                      {transaction.customer.displayName}
                    </td>
                    <td className="w-[10%] truncate">
                      {transaction.qrimg_url}
                    </td>
                    <td className="w-[10%] truncate">
                      {(transaction.customer.from == "line" && "line") ||
                        (transaction.customer.from == "facebook" &&
                          transaction.customer.commentId != null &&
                          "P") ||
                        "IB"}
                    </td>
                    <td className="w-[10%]">
                      <div className="flex gap-2 items-center justify-center">
                        <Link
                          className="btn w-14 text-3xl text-success"
                          href={`/pushimages/${transaction.transactionID}`}
                        >
                          <FaCamera />
                        </Link>
                        <button
                          className="btn w-14 text-3xl text-error"
                          onClick={() => {
                            handleDelete(transaction.id);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
      <div className="w-full flex flex-col xl:hidden my-4">
        {Array.isArray(transactions) &&
          transactions.map((transaction: campaign_transactionsInterface) => (
            <div
              key={transaction.id}
              className="p-4 mt-2 flex flex-col items-center bg-white rounded-xl shadow border-1 border-gray-200"
            >
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                รหัสกองบุญ: <p>{String(transaction.id).padStart(4, "0")}</p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                รายนาม:{" "}
                <p>
                  {transaction.details !== null && <p>{transaction.details}</p>}
                  {transaction.campaign.formDetails === "fullName" && (
                    <p>{transaction.name}</p>
                  )}
                  {transaction.campaign.formDetails === "fullName_BirthDay" && (
                    <div>
                      <p>{transaction.name}</p>
                      <p>
                        {transaction.birthdate} {transaction.birthmonth}{" "}
                        {transaction.birthyear}
                        {" เวลา "}
                        {transaction.birthtime}
                        {" ปีนักษัตร"}
                        {transaction.birthconstellation}
                        {" อายุ "}
                        {transaction.age}
                        {" ปี"}
                      </p>
                    </div>
                  )}
                  {transaction.campaign.formDetails === "many_Names" && (
                    <div>
                      <p>{transaction.many_names}</p>
                    </div>
                  )}
                </p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                จำนวน: <p>{transaction.value}</p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                ชื่อโปรไฟล์: <p>{transaction.customer.displayName}</p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                ที่มา:{" "}
                <p>
                  {(transaction.customer.from == "line" && "line") ||
                    (transaction.customer.from == "facebook" &&
                      transaction.customer.commentId != null &&
                      "P") ||
                    "IB"}
                </p>
              </div>

              <div className="mt-2 text-xl items-center flex flex-row w-full gap-5">
                การจัดการ:
                <div className="flex gap-2 items-center justify-center">
                  <Link
                    className="btn w-14 text-3xl text-success"
                    href={`/pushimages/${transaction.transactionID}`}
                  >
                    <FaCamera />
                  </Link>
                  <button
                    className="btn w-14 text-3xl text-error"
                    onClick={() => {
                      handleDelete(transaction.id);
                    }}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="modal">
        <dialog id="modalCreate" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">เพิ่มรายการร่วมบุญ</h3>
            <div className="border-b-2 border-base-300 mt-2"></div>

            <div className="mt-6 w-full flex flex-col gap-2">
              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-32">รายนาม:</p>
                <textarea
                  id="textareaName"
                  className="textarea w-full"
                  placeholder="กรอกรายนาม"
                  rows={6}
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                  }}
                ></textarea>
              </div>
              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-32">คำขอพร:</p>
                <textarea
                  id="textareaWish"
                  className="textarea w-full"
                  placeholder="กรอกคำขอพร"
                  rows={6}
                  value={form.Wish}
                  onChange={(e) => {
                    setForm({ ...form, Wish: e.target.value });
                  }}
                ></textarea>
              </div>
              <div className="flex flex-row gap-1 xl:items-center">
                <p className="w-32">ตัวเลือกแยกรายการ:</p>
                <div className="w-full flex gap-2">
                  <button
                    className="btn btn-secondary w-20"
                    onClick={HandleSplitName}
                  >
                    แยก
                  </button>
                  {/* <button
                    className="btn btn-secondary w-20"
                    onClick={HandleNoSplitName}
                  >
                    ไม่แยก
                  </button> */}
                </div>
              </div>

              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-32">จำนวน:</p>
                <input
                  value={form.value}
                  onChange={(e) =>
                    setForm({ ...form, value: parseInt(e.target.value) })
                  }
                  type="number"
                  className="input w-full"
                  placeholder="กรอกจำนวน"
                />
              </div>

              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-32">ชื่อโปรไฟล์:</p>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="กรอกชื่อโปรไฟล์"
                  value={form.displayName}
                  onChange={(e) =>
                    setForm({ ...form, displayName: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                <p className="w-32">ที่มา:</p>
                <select
                  className="select w-full"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                >
                  <option value={"L"}>L</option>
                  <option value={"IB"}>IB</option>
                  <option value={"P"}>P</option>
                </select>
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
      </div>
    </div>
  );
}
