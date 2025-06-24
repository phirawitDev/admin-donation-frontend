"use client";

import { getAuthHeaders } from "@/app/component/Headers";
import { customersInterface } from "@/app/interface/customersInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserPen } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function BlankPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<customersInterface[] | null>();
  const [form, setForm] = useState({
    id: 0,
    name: "",
  });

  const fetchCustomers = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/customers/list";
      const headers = getAuthHeaders();

      const customer = await axios.get(url, { headers });
      setCustomers(customer.data);
      setIsLoading(false);
    } catch (error: unknown) {
      const e = error as Error;
      return console.log(e.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
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
    });
  };

  const openUpdateModal = (customer: customersInterface) => {
    setForm({
      id: customer.id,
      name: customer.displayName,
    });

    const modal = document.getElementById(
      "modalUpdate"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/customers/update";
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
          text: "แก้ไขข้อมูลพนักงานสำเร็จ",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchCustomers();
        resetForm();
      }
    } catch (error: unknown) {
      const e = error as Error;
      return console.log(e.message);
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-0 justify-between items-center p-4">
        <h1 className="text-3xl font-bold">ข้อมูลลูกบุญย้อนหลัง</h1>
        <div className="w-full xl:w-auto"></div>
      </div>
      <div className="hidden xl:flex card w-full p-4 bg-base-100 h-[80vh] overflow-hidden overflow-y-auto">
        <table className="table table-fixed text-center">
          <thead className="border-b-2 border-base-300">
            <tr>
              <th>รหัสผู้ร่วมบุญ</th>
              <th>UID</th>
              <th>ชื่อโปรไฟล์</th>
              <th>ที่มา</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(customers) &&
              customers.map((customer: customersInterface) => (
                <tr key={customer.id} className="hover:bg-base-200">
                  <td>{String(customer.id).padStart(4, "0")}</td>
                  <td>{customer.uid}</td>
                  <td>{customer.displayName}</td>
                  <td>{customer.from}</td>
                  <td className="w-[10%]">
                    <button
                      className="text-3xl text-warning btn w-14"
                      onClick={() => openUpdateModal(customer)}
                    >
                      <FaUserPen />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex flex-col xl:hidden my-4">
        {Array.isArray(customers) &&
          customers.map((customer: customersInterface) => (
            <div
              key={customer.id}
              className="p-4 mt-2 flex flex-col items-center bg-white rounded-xl shadow border-1 border-gray-200"
            >
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                รหัสผู้ร่วมบุญ: <p>{String(customer.id).padStart(4, "0")}</p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                UID: <p>{customer.uid}</p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                ชื่อโปรไฟล์: <p>{customer.displayName}</p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                ที่มา: <p>{customer.from}</p>
              </div>
              <div className="mt-2 text-xl items-center flex flex-row w-full gap-5">
                การจัดการ:
                <div className="flex gap-2">
                  <button
                    className="text-3xl text-warning btn w-14"
                    onClick={() => openUpdateModal(customer)}
                  >
                    <FaUserPen />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="modal">
        <dialog id="modalUpdate" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">แก้ไขข้อมูลลูกบุญ</h3>
            <div className="border-b-2 border-base-300 mt-2"></div>
            <form id="formUpdate" onSubmit={handleUpdate}>
              <div className="mt-6 w-full flex flex-col gap-2">
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">ชื่อโปรไฟล์:</p>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="กรอกชื่อโปรไฟล์"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
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
