import { addContact, addSubmission } from "../src/lib/store";

addContact({
  name: "Ahmed Al Maktoum",
  email: "ahmed@example.com",
  phone: "+971 50 123 4567",
  subject: "investment",
  message: "Interested in learning more about real estate investment opportunities in Dubai.",
});

addContact({
  name: "Sarah Johnson",
  email: "sarah.j@email.com",
  phone: "+1 555 123 4567",
  subject: "partnership",
  message: "We are a US-based private equity firm looking for strategic partnerships in the MENA region.",
});

addContact({
  name: "Raj Patel",
  email: "raj.patel@company.com",
  phone: "+91 98765 43210",
  subject: "general",
  message: "I would like to schedule a call to discuss potential collaboration opportunities.",
});

addContact({
  name: "Maria Garcia",
  email: "maria@investgroup.com",
  phone: "+34 612 345 678",
  subject: "investment",
  message: "Our institutional investment group is interested in your hospitality sector portfolio.",
});

addSubmission({
  firstName: "James",
  lastName: "Mitchell",
  email: "james@mitchellcapital.com",
  phone: "+44 7700 123456",
  company: "Mitchell Capital Partners",
  opportunityType: "investment",
  investmentRange: "5m-25m",
  message: "We have a compelling investment opportunity in the fintech space with a strong management team and proven traction in the European market.",
  fileName: "pitch-deck-2026.pdf",
});

addSubmission({
  firstName: "Lisa",
  lastName: "Chen",
  email: "lisa@chenholdings.com",
  phone: "+65 9123 4567",
  company: "Chen Holdings Pte Ltd",
  opportunityType: "joint-venture",
  investmentRange: "1m-5m",
  message: "Proposing a joint venture for a logistics and distribution center in the Dubai South corridor, capitalizing on the growing e-commerce demand.",
  fileName: "",
});

addSubmission({
  firstName: "Omar",
  lastName: "Al Rashid",
  email: "omar@alrashidgroup.com",
  phone: "+971 55 555 5555",
  company: "Al Rashid Group",
  opportunityType: "partnership",
  investmentRange: "25m-100m",
  message: "Our family office is seeking a strategic partnership to co-invest in large-scale real estate developments across the UAE.",
  fileName: "partnership-proposal.docx",
});

console.log("Seed data added successfully!");
