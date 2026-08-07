import mongoose, { Schema, Document } from "mongoose";

export interface ISocialLink {
  platform: string;
  url: string;
}

export type ChatButtonType = "whatsapp" | "telegram" | "zalo" | "livechat";

export interface IChatButton {
  type: ChatButtonType;
  enabled: boolean;
  /** Số điện thoại (whatsapp/zalo/telegram) hoặc URL đầy đủ (livechat) */
  value: string;
  /** Tin nhắn mặc định (whatsapp/telegram) */
  messageVi?: string;
  messageEn?: string;
}

export interface ISettings extends Document {
  companyName: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  googleMap: string;
  socialLinks: ISocialLink[];
  googleAnalyticsId: string;
  metaPixelId: string;
  footer: string;
  chatButtons: IChatButton[];
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const ChatButtonSchema = new Schema<IChatButton>(
  {
    type: { type: String, enum: ["whatsapp", "telegram", "zalo", "livechat"], required: true },
    enabled: { type: Boolean, default: true },
    value: { type: String, default: "" },
    messageVi: { type: String, default: "" },
    messageEn: { type: String, default: "" },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    companyName: { type: String, default: "Fortress Investment Holdings" },
    logo: { type: String, default: "/large-logo.png" },
    favicon: { type: String, default: "" },
    email: { type: String, default: "info@fortressih.com" },
    phone: { type: String, default: "+971 4 XXX XXXX" },
    address: { type: String, default: "Dubai, United Arab Emirates" },
    whatsapp: { type: String, default: "971500000000" },
    googleMap: { type: String, default: "" },
    socialLinks: [SocialLinkSchema],
    googleAnalyticsId: { type: String, default: "" },
    metaPixelId: { type: String, default: "" },
    footer: { type: String, default: "" },
    chatButtons: { type: [ChatButtonSchema], default: [
      { type: "whatsapp", enabled: true, value: "971500000000", messageVi: "Xin chào, tôi muốn tìm hiểu thêm về Fortress Investment Holdings.", messageEn: "Hello, I would like to enquire about Fortress Investment Holdings." },
    ]},
  },
  { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
