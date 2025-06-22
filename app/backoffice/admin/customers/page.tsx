"use client";

import { getAuthHeaders } from "@/app/component/Headers";
import { customersInterface } from "@/app/interface/customersInterface";
import axios from "axios";
import { useEffect, useState } from "react";

export default function BlankPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<customersInterface[] | null>();

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

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-0 justify-between items-center p-4">
        <h1 className="text-3xl font-bold">ข้อมูลลูกบุญย้อนหลัง</h1>
        <div className="w-full xl:w-auto"></div>
      </div>
      <div className="hidden xl:flex card w-full p-4 bg-base-100">
        <table className="table text-center">
          <thead className="border-b-2 border-base-300">
            <tr>
              <th>รหัสผู้ร่วมบุญ</th>
              <th>UID</th>
              <th>ชื่อโปรไฟล์</th>
              <th>ที่มา</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(customers) &&
              customers.map((customer: customersInterface) => (
                <tr key={customer.id} className="hover:bg-base-200">
                  <td>{String(customer.id).padStart(5, "0")}</td>
                  <td>{customer.uid}</td>
                  <td>{customer.displayName}</td>
                  <td>{customer.from}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
