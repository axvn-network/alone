/**
 * src/modules/settings/service.ts
 * Settings service — canonical implementation.
 */
import { connectDB } from "@/core/database";
import Settings, { type ISettings } from "@/modules/settings/model";

const DEFAULT_SETTINGS = {
  companyName: "AXVN Tech Holding",
  logo: "/large-logo.png",
  favicon: "",
  email: "",
  phone: "",
  address: "",
  whatsapp: "",
  googleMap: "",
  socialLinks: [],
  googleAnalyticsId: "",
  metaPixelId: "",
  footer: "",
  chatButtons: [],
};

export async function getSettings(): Promise<ISettings> {
  await connectDB();
  const doc = await Settings.findOne({}).lean<ISettings>();
  if (!doc) {
    return Settings.create(DEFAULT_SETTINGS) as unknown as ISettings;
  }
  return doc;
}

export async function getPublicSettings() {
  return getSettings();
}

export async function updateSettings(data: Partial<ISettings>) {
  await connectDB();
  const doc = await Settings.findOneAndUpdate(
    {},
    { $set: data },
    { new: true, upsert: true },
  ).lean();
  return doc;
}
