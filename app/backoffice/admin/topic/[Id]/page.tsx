"use client";

import { campaignsInterface } from "@/app/interface/campaignsInterface";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopicDetailsPage() {
  const { Id } = useParams();
  const [campaign, setCampaign] = useState<campaignsInterface[] | null>();

  const fetchcampaigns = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + `/topic/campaign/${Id}`;
    const res = await axios.get(url);
    setCampaign(res.data);
  };

  useEffect(() => {
    fetchcampaigns();
  }, [Id]);

  useEffect(() => {
    console.log(campaign);
  }, [campaign]);

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-0 justify-between items-center p-4">
        <h1 className="text-3xl font-bold">กองบุญงาน: </h1>
      </div>
      <div className="hidden xl:flex card w-full p-4 bg-base-100 h-[80vh] overflow-hidden overflow-y-auto">
        <table className="table text-center">
          <thead className="border-b-2 border-base-300">
            <tr>
              <th>รหัสกองบุญ</th>
              <th className="w-[40%]">ชื่อกองบุญ</th>
              <th>ราคา</th>
              <th>ยอดร่วมบุญ</th>
              <th>ยอดเงิน</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(campaign) &&
              campaign.map((item: campaignsInterface) => (
                <tr>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td></td>
                  <td>asdasdasd</td>
                </tr>
              ))}

            <tr>
              <td colSpan={4} className="text-right">
                ยอดรวมรายได้
              </td>
              <td colSpan={1}>3434</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
