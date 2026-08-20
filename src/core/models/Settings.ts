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
  /** WhatsApp number (E.164, e.g. "971500000000") — legacy field kept for compat */
  whatsapp: string;
  googleMap: string;
  socialLinks: ISocialLink[];
  googleAnalyticsId: string;
  metaPixelId: string;
  footer: string;
  chatButtons: IChatButton[];
  /** Custom legal/compliance footer text (HTML-safe) */
  footerLegal: string;
  /** Name displayed in outgoing email notifications */
  smtpFromName: string;
  /** Reply-to email address for outgoing notifications */
  smtpFromEmail: string;
  updatedAt: Date;
  createdAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const ChatButtonSchema = new Schema<IChatButton>(
  {
    type: {
      type: String,
      enum: ["whatsapp", "telegram", "zalo", "livechat"],
      required: true,
    },
    enabled: { type: Boolean, default: true },
    value: { type: String, default: "" },
    messageVi: { type: String, default: "" },
    messageEn: { type: String, default: "" },
  },
  { _id: false },
);

const SettingsSchema = new Schema<ISettings>(
  {
    companyName: { type: String, default: "AXVN Tech Holding" },
    logo: { type: String, default: "/large-logo.png" },
    favicon: { type: String, default: "" },
    email: { type: String, default: "info@axvn.vn" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    googleMap: { type: String, default: "" },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    googleAnalyticsId: { type: String, default: "" },
    metaPixelId: { type: String, default: "" },
    footer: { type: String, default: "" },
    chatButtons: {
      type: [ChatButtonSchema],
      default: [
        {
          type: "whatsapp",
          enabled: false,
          value: "",
          messageVi: "Xin chào, tôi muốn tìm hiểu thêm về AXVN Tech Holding.",
          messageEn: "Hello, I would like to enquire about AXVN Tech Holding.",
        },
      ],
    },
    footerLegal: { type: String, default: "" },
    smtpFromName: { type: String, default: "AXVN Tech Holding" },
    smtpFromEmail: { type: String, default: "" },
  },
  { timestamps: true },
);

const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
