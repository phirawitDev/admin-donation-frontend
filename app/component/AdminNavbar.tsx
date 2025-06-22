"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaAddressBook,
  FaDonate,
  FaHome,
  FaList,
  FaUsers,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "../interface/tokenInterface";
import Swal from "sweetalert2";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

export default function AdminNavbar() {
  const url = usePathname();
  const pathname = url.split("/")[3];
  const router = useRouter();
  const [users, setUsers] = useState<TokenPayload | null>();
  const tokenname = process.env.NEXT_PUBLIC_TOKEN_NAME || "";

  useEffect(() => {
    const token = localStorage.getItem(tokenname);

    if (!token) {
      router.push("/");
      return;
    }
    const decoded = jwtDecode<TokenPayload>(token);

    setUsers(decoded);
    try {
    } catch {
      router.push("/");
    }
  }, [tokenname, router]);

  const handleSignOut = async () => {
    const button = await Swal.fire({
      title: "ออกจากระบบ",
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      customClass: {
        confirmButton: "btn btn-primary mr-2",
        cancelButton: "btn btn-base-100",
      },
      buttonsStyling: false,
    });

    if (button.isConfirmed) {
      localStorage.removeItem(tokenname);
      router.push("/");
    }
  };
  return (
    <>
      <h1 className="text-2xl font-bold text-center">
        ระบบจัดการกองบุญออนไลน์
      </h1>

      <div className="flex xl:hidden items-center text-2xl">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="drawer-button">
            <GiHamburgerMenu />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu bg-neutral text-base-100 h-full w-full p-4 flex flex-col justify-between">
            <div className="flex flex-col w-full justify-between items-center">
              <div className="flex justify-between w-full items-center text-3xl mt-1">
                <h1 className="text-2xl font-bold text-center">เมนูหลัก</h1>
                <label htmlFor="my-drawer" className="drawer-button">
                  <IoMdClose />
                </label>
              </div>
              <div className="flex flex-col justify-between w-full bg-neutral text-base-100 h-full p-4">
                <div className="flex flex-col gap-4 mt-5 justify-center ">
                  <Link
                    href="/backoffice/admin/dashboard"
                    className={`flex items-center gap-2 text-xl ${
                      pathname.includes("dashboard")
                        ? "text-neutral bg-base-300 scale-110 ml-8 pl-2 py-1 rounded-l-xl z-0"
                        : "text-white  "
                    }`}
                  >
                    <FaHome /> แดชบอร์ด
                  </Link>
                  <Link
                    href="/backoffice/admin/campaigns"
                    className={`flex items-center gap-2 text-xl ${
                      pathname.includes("campaigns")
                        ? "text-neutral bg-base-300 scale-110 ml-8 pl-2 py-1 rounded-l-xl z-0"
                        : "text-white  "
                    }`}
                  >
                    <FaDonate /> จัดการกองบุญ
                  </Link>
                  <Link
                    href="/backoffice/admin/topic"
                    className={`flex items-center gap-2 text-xl ${
                      pathname.includes("topic")
                        ? "text-neutral bg-base-300 scale-110 ml-8 pl-2 py-1 rounded-l-xl z-0"
                        : "text-white  "
                    }`}
                  >
                    <FaList /> หัวข้อกองบุญ
                  </Link>
                  <Link
                    href="/backoffice/admin/customers"
                    className={`flex items-center gap-2 text-xl ${
                      pathname.includes("customers")
                        ? "text-neutral bg-base-300 scale-110 ml-8 pl-2 py-1 rounded-l-xl z-0"
                        : "text-white  "
                    }`}
                  >
                    <FaAddressBook /> ลูกบุญย้อนหลัง
                  </Link>
                  <Link
                    href="/backoffice/admin/users"
                    className={`flex items-center gap-2 text-xl ${
                      pathname.includes("users")
                        ? "text-neutral bg-base-300 scale-110 ml-8 pl-2 py-1 rounded-l-xl z-0"
                        : "text-white  "
                    }`}
                  >
                    <FaUsers /> จักการพนักงาน
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full card bg-base-100 text-base-content h-40 mb-16 flex flex-col gap-4 items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <p className="w-full truncate text-center">{users?.name}</p>
                <p className="text-sm">สิทธิ์การใช้งาน: {users?.role}</p>
              </div>
              <button className="btn btn-error w-40" onClick={handleSignOut}>
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
