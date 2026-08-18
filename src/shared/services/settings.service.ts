import Settings, { type ISettings } from "@/core/models/Settings";
import type { SettingsInput } from "@/validators";
import { connectDB } from "@/core/database/db";
import { logger } from "@/shared/utils/logger";

const DEFAULT_SETTINGS = {
  companyName: "AXVN Tech Holding",
  logo: "/large-logo.png",
  favicon: "",
  email: "info@axvn.vn",
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
      messageVi: "Xin chào, tôi muốn tìm hiểu thêm về AXVN Tech Holding.",
      messageEn: "Hello, I would like to enquire about AXVN Tech Holding.",
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
        logger.warn("Could not create settings document, using fallback defaults:", err);
        return DEFAULT_SETTINGS as unknown as ISettings;
      }
    }
    return settings;
  } catch (err) {
    logger.error("Database connection/query error in getSettings:", err);
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
    companyName: settings.companyName,
    logo: settings.logo,
    favicon: settings.favicon,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    whatsapp: settings.whatsapp,
    googleMap: settings.googleMap,
    socialLinks: settings.socialLinks,
    googleAnalyticsId: settings.googleAnalyticsId,
    metaPixelId: settings.metaPixelId,
    footer: settings.footer,
    chatButtons: settings.chatButtons,
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
