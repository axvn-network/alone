import Settings, { type ISettings } from "@/models/Settings";
import type { SettingsInput } from "@/validators";
import { connectDB } from "@/lib/db";

const DEFAULT_SETTINGS = {
  companyName: "GVI Tech Holding",
  logo: "/large-logo.png",
  favicon: "",
  email: "info@gvitech.vn",
  phone: "",
  address: "Việt Nam",
  whatsapp: "",
  googleMap: "",
  socialLinks: [
    { platform: "LinkedIn", url: "#" },
    { platform: "Instagram", url: "#" },
    { platform: "Facebook", url: "#" },
    { platform: "X (Twitter)", url: "#" },
    { platform: "YouTube", url: "#" },
  ],
  googleAnalyticsId: "",
  metaPixelId: "",
  footer: "",
  chatButtons: [
    {
      type: "whatsapp" as const,
      enabled: false,
      value: "",
      messageVi: "Xin chào, tôi muốn tìm hiểu thêm về GVI Tech Holding.",
      messageEn: "Hello, I would like to enquire about GVI Tech Holding.",
    },
  ],
};

export async function getSettings() {
  try {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      try {
        settings = await Settings.create(DEFAULT_SETTINGS);
        settings = settings.toObject ? settings.toObject() : settings;
      } catch (err) {
        console.warn("Could not create settings document, using fallback defaults:", err);
        return DEFAULT_SETTINGS as unknown as ISettings;
      }
    }
    return settings;
  } catch (err) {
    console.error("Database connection/query error in getSettings:", err);
    return DEFAULT_SETTINGS as unknown as ISettings;
  }
}

/**
 * Public-safe settings — strips sensitive or internal fields.
 * Returned for the public-facing site layout (footer, chat buttons, social).
 */
export async function getPublicSettings() {
  const settings = await getSettings();
  return {
    companyName:      settings.companyName,
    logo:             settings.logo,
    favicon:          settings.favicon,
    email:            settings.email,
    phone:            settings.phone,
    address:          settings.address,
    whatsapp:         settings.whatsapp,
    googleMap:        settings.googleMap,
    socialLinks:      settings.socialLinks,
    googleAnalyticsId: settings.googleAnalyticsId,
    metaPixelId:      settings.metaPixelId,
    footer:           settings.footer,
    chatButtons:      settings.chatButtons,
  };
}

export async function updateSettings(data: SettingsInput) {
  await connectDB();
  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: data },
    { new: true, upsert: true, runValidators: true }
  ).lean();
  return settings;
}
