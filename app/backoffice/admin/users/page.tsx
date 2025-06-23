"use client";

import { getAuthHeaders } from "@/app/component/Headers";
import { usersInterface } from "@/app/interface/usersInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus, FaUserMinus } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function BlankPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<usersInterface[] | null>();
  const [form, setForm] = useState({
    id: 0,
    name: "",
    username: "",
    password: "",
    role: "",
  });

  const fetchUsers = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/users/list";
    const headers = getAuthHeaders();

    const usersdata = await axios.get(url, { headers: headers });

    if (usersdata.status == 200) {
      setUsers(usersdata.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      const url = process.env.NEXT_PUBLIC_API_URL + "/users/create";
      const headers = getAuthHeaders();

      const create = await axios.post(url, form, { headers });

      if (create.status == 200) {
        const modal = document.getElementById(
          "modalUserCreate"
        ) as HTMLDialogElement | null;
        modal?.close();

        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลสำเร็จ",
          text: "เพิ่มข้อมูลพนักงานใหม่สำเร็จ",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchUsers();
        resetForm();
      }
    } catch (error: unknown) {
      const modal = document.getElementById(
        "modalUserCreate"
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

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      username: "",
      password: "",
      role: "",
    });
  };

  const openUpdateModal = (user: usersInterface) => {
    setForm({
      id: user.id,
      name: user.name,
      username: user.username,
      password: "",
      role: user.role,
    });

    const modal = document.getElementById(
      "modalUserUpdate"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/users/update";
      const headers = getAuthHeaders();

      const update = await axios.put(url, form, { headers });

      if (update.status == 200) {
        const modal = document.getElementById(
          "modalUserUpdate"
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
        fetchUsers();
        resetForm();
      }
    } catch (error: unknown) {
      const modal = document.getElementById(
        "modalUserUpdate"
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
        const url = process.env.NEXT_PUBLIC_API_URL + `/users/delete/${id}`;
        const headers = getAuthHeaders();

        const deleteData = await axios.delete(url, { headers });

        if (deleteData.status == 200) {
          Swal.fire({
            icon: "success",
            title: "ลบข้อมูลสำเร็จ",
            text: "ลบข้อมูลพนักงานสำเร็จ",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          fetchUsers();
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
            <FaPlus /> เพิ่มพนักงาน
          </button>
        </div>
      </div>
      <div className="hidden xl:flex card w-full p-4 bg-base-100 h-[80vh] overflow-hidden overflow-y-auto">
        <table className="table text-center">
          <thead className="border-b-2 border-base-300">
            <tr>
              <th>รหัสพนักงาน</th>
              <th className="w-[30%]">ชื่อพนักงาน</th>
              <th className="w-[30%]">ชื่อผู้ใช้</th>
              <th>สิทธิ์การใช้งาน</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.map((user: usersInterface) => (
                <tr key={user.id} className="hover:bg-base-200">
                  <td>{String(user.id).padStart(3, "0")}</td>
                  <td className="text-left truncate">{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.role == "ADMIN" ? "แอดมิน" : "พนักงาน"}</td>
                  <td className="flex gap-2 justify-center">
                    <button
                      className="text-3xl text-warning btn w-14"
                      onClick={() => openUpdateModal(user)}
                    >
                      <FaUserPen />
                    </button>
                    <button
                      className="text-3xl text-error btn w-14"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaUserMinus />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex flex-col xl:hidden my-4">
        {Array.isArray(users) &&
          users.map((user: usersInterface) => (
            <div
              key={user.id}
              className="p-4 mt-2 flex flex-col items-center bg-white rounded-xl shadow border-1 border-gray-200"
            >
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                รหัสพนักงาน: <p>{String(user.id).padStart(4, "0")}</p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                ชื่อพนักงาน: <p>{user.name}</p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                ชื่อผู้ใช้: <p>{user.username}</p>
              </div>
              <div className="flex flex-row w-full gap-5 mt-2 text-xl border-b-1 border-gray-200 truncate">
                สิทธิ์การใช้งาน:{" "}
                <p>{user.role == "ADMIN" ? "แอดมิน" : "พนักงาน"}</p>
              </div>

              <div className="mt-2 text-xl items-center flex flex-row w-full gap-5">
                การจัดการ:
                <div className="flex gap-2">
                  <button
                    className="text-3xl text-warning btn w-14"
                    onClick={() => openUpdateModal(user)}
                  >
                    <FaUserPen />
                  </button>
                  <button
                    className="text-3xl text-error btn w-14"
                    onClick={() => handleDelete(user.id)}
                  >
                    <FaUserMinus />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="modal">
        <dialog id="modalUserCreate" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">เพิ่มพนักงาน</h3>
            <div className="border-b-2 border-base-300 mt-2"></div>
            <form id="formUserCreate" onSubmit={handleCreate}>
              <div className="mt-6 w-full flex flex-col gap-2">
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">ชื่อพนักงาน:</p>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="กรอกชื่อพนักงาน"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">ชื่อผู้ใช้:</p>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="กรอกชื่อผู้ใช้"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">รหัสผ่าน:</p>
                  <input
                    type="password"
                    className="input w-full"
                    placeholder="กรอกรหัสผ่าน"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">สิทธิ์การใช้งาน:</p>
                  <select
                    value={form.role}
                    className="select w-full"
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value={""} disabled={true}>
                      เลือกสิทธิ์การใช้งาน
                    </option>
                    <option value={"ADMIN"}>แอดมิน</option>
                    <option value={"EMPLOYEE"}>พนักงาน</option>
                  </select>
                </div>
              </div>
            </form>
            <div className="modal-action flex gap-2">
              <button
                className="btn btn-primary w-16"
                type="submit"
                form="formUserCreate"
              >
                บันทึก
              </button>
              <form method="dialog">
                <button className="btn w-16">ออก</button>
              </form>
            </div>
          </div>
        </dialog>

        <dialog id="modalUserUpdate" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">แก้ไขข้อมูลพนักงาน</h3>
            <div className="border-b-2 border-base-300 mt-2"></div>
            <form id="formUserUpdate" onSubmit={handleUpdate}>
              <div className="mt-6 w-full flex flex-col gap-2">
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">ชื่อพนักงาน:</p>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="กรอกชื่อพนักงาน"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">ชื่อผู้ใช้:</p>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="กรอกชื่อผู้ใช้"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">รหัสผ่าน:</p>
                  <input
                    type="password"
                    className="input w-full"
                    placeholder="หากไม่เปลื่ยนให้ว่างไว้...."
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col xl:flex-row gap-1 xl:items-center">
                  <p className="w-40">สิทธิ์การใช้งาน:</p>
                  <select
                    value={form.role}
                    className="select w-full"
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value={""} disabled={true}>
                      เลือกสิทธิ์การใช้งาน
                    </option>
                    <option value={"ADMIN"}>แอดมิน</option>
                    <option value={"EMPLOYEE"}>พนักงาน</option>
                  </select>
                </div>
              </div>
            </form>
            <div className="modal-action flex gap-2">
              <button
                className="btn btn-primary w-16"
                type="submit"
                form="formUserUpdate"
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
