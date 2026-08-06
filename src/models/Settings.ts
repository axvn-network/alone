import mongoose, { Schema, Document } from "mongoose";

export interface ISocialLink {
  platform: string;
  url: string;
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
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
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
  },
  { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
