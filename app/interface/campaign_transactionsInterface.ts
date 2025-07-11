import { campaignsInterface } from "./campaignsInterface";
import { customersInterface } from "./customersInterface";
import { transactiondetailsInterface } from "./transactiondetailsInterface";

export interface campaign_transactionsInterface {
  id: number;
  campaignId: number;
  value: number;
  slip_img: string;
  img_url: string;
  qrimg_url: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  campaign: campaignsInterface;
  transactiondetails: transactiondetailsInterface[];
  customer: customersInterface;
  transactionID: string;
  details: string;
  name: string;
  birthdate: string;
  birthmonth: string;
  birthyear: string;
  birthtime: string;
  birthconstellation: string;
  age: string;
  many_names: string;
  wish: string;
}
