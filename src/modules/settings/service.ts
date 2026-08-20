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
  footerLegal: "",
  smtpFromName: "AXVN Tech Holding",
  smtpFromEmail: "",
  chatButtons: [],
};

/** Full settings — admin only */
export async function getSettings(): Promise<ISettings> {
  await connectDB();
  const doc = await Settings.findOne({}).lean<ISettings>();
  if (!doc) {
    return Settings.create(DEFAULT_SETTINGS) as unknown as ISettings;
  }
  return doc;
}

/** Public-safe settings — strips SMTP credentials before returning */
export async function getPublicSettings() {
  const doc = await getSettings();
  // Return plain object without SMTP fields — never expose mail credentials publicly
  const { smtpFromEmail: _e, smtpFromName: _n, ...publicFields } =
    doc as ISettings & Record<string, unknown>;
  void _e; void _n;
  return publicFields;
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
