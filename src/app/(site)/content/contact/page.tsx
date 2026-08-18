import ContactForm from "./components/ContactForm";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import PageHero from "@/modules/content/components/PageHero";
import SectionHeader from "@/modules/content/components/SectionHeader";
import type { Metadata } from "next";
import { getSettings } from "@/modules/settings";

export const metadata: Metadata = {
  title: "Liên Hệ | AXVN Tech Holding",
  description:
    "Liên hệ với AXVN Tech Holding. Đội ngũ chuyên gia sẵn sàng tiếp nhận và phản hồi thông tin yêu cầu của bạn trong vòng 1–2 ngày làm việc.",
  openGraph: {
    title: "Liên Hệ | AXVN Tech Holding",
    description: "Kết nối trực tiếp với đội ngũ đầu tư của AXVN Tech Holding.",
  },
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  let whatsapp = "971500000000";
  let phoneVal = "+971 4 XXX XXXX";
  let emailVal = "info@axvn.vn";
  let addressVal = "Dubai, Các Quốc Gia Ả Rập Thống Nhất";
  try {
    const settings = await getSettings();
    if (settings) {
      whatsapp = settings.whatsapp || whatsapp;
      phoneVal = settings.phone || phoneVal;
      emailVal = settings.email || emailVal;
      addressVal = settings.address || addressVal;
    }
  } catch {
    // Use defaults
  }

  const contactInfo = [
    {
      icon: Phone,
      label: "Điện thoại liên hệ",
      value: phoneVal,
      href: `tel:${phoneVal.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Hộp thư Email",
      value: emailVal,
      href: `mailto:${emailVal}`,
    },
    {
      icon: MapPin,
      label: "Trụ sở làm việc",
      value: addressVal,
      href: "#map",
    },
    {
      icon: Clock,
      label: "Giờ làm việc",
      value: "Thứ 2 – Thứ 6, 8:30 – 17:30",
      href: "#",
    },
  ];

  return (
    <main className="min-h-screen bg-white pb-safe md:pb-0">
      {/* ── Hero ── */}
      <PageHero
        tag="Liên Hệ"
        heading={
          <>
            Bắt Đầu{" "}
            <span className="font-bold bg-gradient-to-r from-AXVN-gold to-AXVN-champagne bg-clip-text text-transparent">
              Cuộc Đối Thoại
            </span>
          </>
        }
        description="Dù bạn có thắc mắc về cơ hội đầu tư, muốn đề xuất dự án hay đơn giản muốn tìm hiểu thêm về AXVN Tech Holding — đội ngũ chuyên gia luôn sẵn sàng lắng nghe và phản hồi."
      />

      {/* ── Thông tin liên hệ ── */}
      <section
        className="bg-AXVN-navy rounded-2xl section-mx section-my"
        style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
      >
        <div className="max-w-[1400px] mx-auto section-px">
          <div className="text-center mb-10 md:mb-12">
            <SectionHeader
              tag="Kết Nối Trực Tiếp"
              heading="Thông Tin Liên Hệ"
              dark
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {contactInfo.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group flex items-center gap-4 p-5 bg-AXVN-deep border border-AXVN-gold/10 hover:border-AXVN-gold/30 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl"
              >
                <div className="w-11 h-11 bg-AXVN-gold/10 border border-AXVN-gold/15 flex items-center justify-center flex-shrink-0 rounded-sm group-hover:bg-AXVN-gold/20 transition-colors">
                  <item.icon className="w-5 h-5 text-AXVN-gold" />
                </div>
                <div>
                  <p className="text-AXVN-silver/55 text-xs mb-0.5">{item.label}</p>
                  <p className="text-AXVN-ivory font-medium text-sm">{item.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Bản đồ ── */}
      <section className="section-mx section-my">
        <div className="max-w-[1400px] mx-auto section-px">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-2 bg-white border border-AXVN-navy/8 rounded-2xl p-7 md:p-10">
              <h2
                className="font-semibold text-AXVN-navy mb-2 leading-snug"
                style={{ fontSize: "var(--text-h3)" }}
              >
                Gửi Lời Nhắn Trực Tiếp
              </h2>
              <p className="text-AXVN-navy/55 mb-7" style={{ fontSize: "var(--text-body)" }}>
                Đội ngũ tư vấn sẽ phản hồi trong vòng 1–2 ngày làm việc.
              </p>
              <ContactForm />
              <div className="mt-8 pt-7 border-t border-AXVN-navy/8">
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-all duration-300 text-sm font-medium rounded-xl shadow-sm shadow-green-500/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhắn Tin Qua WhatsApp
                </a>
              </div>
            </div>

            {/* Map */}
            <div
              className="lg:col-span-3 bg-AXVN-charcoal border border-AXVN-gold/10 rounded-2xl overflow-hidden min-h-[520px]"
              id="map"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.643879742878!2d55.2708!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d348d56a8df%3A0x2e84e1b4b4b4b4b4!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sae!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.5) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vị trí văn phòng AXVN Tech Holding — Dubai, UAE"
                className="w-full h-full min-h-[520px]"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
