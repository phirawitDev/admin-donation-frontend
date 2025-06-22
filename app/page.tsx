"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FaLine } from "react-icons/fa";

interface TokenPayload {
  id: string;
  name: string;
  role: string;
  exp?: number;
}

export default function LoginPage() {
  const [isReady, setIsReady] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token_");
    if (!token) {
      setIsReady(true);
      return;
    }

    try {
      const decoded: TokenPayload = jwtDecode(token);
      const role = decoded.role;

      if (role === "ADMIN") {
        router.push("/backoffice/admin/dashboard");
      } else if (role === "EMPLOYEE") {
        router.push("/backoffice/employee/pos");
      }
    } catch (err) {
      console.error("Token parsing failed:", err);
    }
  }, [router]);

  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    if (username == "" && password == "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน...",
        icon: "error",
      });
      return;
    } else if (username == "") {
      Swal.fire({
        title: "กรุณากรอกชื่อผู้ใช้งาน",
        icon: "warning",
      });
      return;
    } else if (password == "") {
      Swal.fire({
        title: "กรุณากรอกรหัสผ่าน",
        icon: "warning",
      });
      return;
    }

    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/users/signin";
      const payload = {
        username: username,
        password: password,
      };

      const result = await axios.post(url, payload);
      const tokenname = process.env.NEXT_PUBLIC_TOKEN_NAME;

      if (result.data.token != null) {
        localStorage.setItem(tokenname!, result.data.token);
        if ((result.data.user.role = "ADMIN")) {
          router.push("/backoffice/admin/dashboard");
        } else if ((result.data.user.role = "EMPLOYEE")) {
          router.push("/backoffice/employee/pos");
        }
      }
    } catch {
      Swal.fire({
        title: "ไม่สามารถเข้าสู่ระบบได้",
        text: "ชื่อผู้ใช้งานหรือรหัสผ่านผิดโปรดลองอีกครั้ง...",
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-full p-2 h-[100vh] bg-linear-to-bl from-secondary to-primary">
        <div className="card md:w-1/3 bg-base-100 p-4 md:p-10">
          <h1 className="text-4xl text-center ">ระบบกองบุญออนไลน์</h1>
          <h1 className="mt-2 text-2xl text-center text-neutral">
            วิหารพระโพธิสัตว์กวนอิมทุ่งพิชัย
          </h1>
          <form
            className="flex flex-col gap-5 w-full mt-10"
            onSubmit={handleSignIn}
          >
            <div className="flex flex-col gap-2">
              <p className="text-neutral text-2xl">ชื่อผู้ใช้</p>
              <input
                type="text"
                placeholder="โปรดกรอกชื่อผู้ใช้งาน"
                className="input w-full"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-neutral text-2xl">รหัสผ่าน</p>
              <input
                type="text"
                placeholder="โปรดกรอกรหัสผ่าน"
                className="input w-full"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" type="submit">
              เข้าสู่ระบบ
            </button>
          </form>
          <div className="flex items-center justify-between mt-4">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-gray-500 ">หรือ</span>
            <hr className="w-full border-gray-300 " />
          </div>
          <button className="btn mt-4">
            <FaLine className="text-success text-2xl" /> เข้าสู่ระบบด้วยไลน์
          </button>
        </div>
      </div>
    </>
  );
}
