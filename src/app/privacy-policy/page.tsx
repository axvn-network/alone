import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật | Fortress Investment Holdings",
  description:
    "Chính sách bảo mật thông tin của Fortress Investment Holdings. Tìm hiểu cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của bạn.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-white pt-24 md:pt-32 pb-12 md:pb-20 text-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <p className="text-fortress-gold text-xs md:text-sm font-medium tracking-[2px] md:tracking-[4px] uppercase mb-4">
            Pháp Lý
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-fortress-navy mb-4">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-fortress-charcoal/70 text-sm">
            Cập nhật lần cuối: 2026
          </p>
        </div>
      </section>

      <section className="bg-white my-8 md:my-12 sm:mx-4 rounded-2xl py-12 md:py-20 px-6 lg:px-20">
        <div className="max-w-[860px] mx-auto">
          <div className="space-y-10 text-fortress-charcoal/70 leading-relaxed text-sm sm:text-base">

            <p>
            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Document Uploads</h2>
              <p>
                Documents uploaded through the website may contain confidential, financial, corporate, or personal information. Please only upload information you are authorised to provide.
              </p>
              <p className="mt-4">
                Submitting documents does not create a formal confidential, advisory, investment, partnership, or contractual relationship unless separately agreed in writing. If your information requires a formal non-disclosure agreement, contact our team before submitting.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Cookies and Tracking Technologies</h2>
              <p>
                Our website may use cookies and similar technologies to improve functionality, understand usage, measure performance, and support marketing relevance through tools including Google Analytics and Meta Pixel.
              </p>
              <p className="mt-4">
                You may manage cookies through your browser settings or the website&apos;s cookie consent tool.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Sharing of Information</h2>
              <p>We do not sell personal information. Information may be shared with:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Employees and authorised representatives</li>
                <li>Professional advisors</li>
                <li>Technology, hosting, website, and analytics providers</li>
                <li>Legal or regulatory authorities where required</li>
                <li>Service providers supporting our operations</li>
              </ul>
              <p className="mt-4">All third parties are expected to handle information responsibly and only for legitimate purposes.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Data Security</h2>
              <p>
                We take reasonable administrative, technical, and organisational measures to protect information against unauthorised access, loss, misuse, alteration, or disclosure. However, no internet transmission or electronic storage system can be guaranteed to be completely secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Data Retention</h2>
              <p>
                We retain personal information for as long as reasonably necessary to respond to enquiries, evaluate opportunities, maintain business records, meet legal obligations, resolve disputes, and protect legitimate business interests.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Your Rights</h2>
              <p>Depending on applicable law, you may have the right to:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Request access to or correction of your personal information</li>
                <li>Request deletion of information</li>
                <li>Withdraw marketing consent</li>
                <li>Object to or request restriction of certain processing</li>
              </ul>
              <p className="mt-4">Requests may be submitted using the contact information below.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fortress-navy mb-4">Contact</h2>
              <p>For privacy-related questions:</p>
              <div className="mt-3 space-y-1">
                <p>Fortress Investment Holdings</p>
                <p>Email: [INSERT PRIVACY EMAIL]</p>
                <p>Address: [INSERT OFFICE ADDRESS]</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
