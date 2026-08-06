export interface PaymentConfig {
  momoKey: string;
  bankKey: string;
  usdtWallet: string;
  telcoKey: string;
}

export const getPaymentConfig = (): PaymentConfig => ({
  momoKey: process.env.PAYMENT_MOMO_KEY || "",
  bankKey: process.env.PAYMENT_BANK_KEY || "",
  usdtWallet: process.env.PAYMENT_USDT_WALLET || "",
  telcoKey: process.env.PAYMENT_TELCO_KEY || "",
});

export const PAYMENT_METHODS = [
  {
    id: "momo",
    name: "Ví MoMo",
    description: "Thanh toán qua ví điện tử MoMo nhanh chóng",
    icon: "Wallet",
    active: true,
  },
  {
    id: "bank",
    name: "Chuyển khoản Ngân hàng (VietQR)",
    description: "Chuyển khoản tự động xác nhận qua mã QR VietQR",
    icon: "Building2",
    active: true,
  },
  {
    id: "usdt",
    name: "Tiền điện tử USDT (BEP20)",
    description: "Nạp tiền qua mạng lưới Binance Smart Chain (BEP20)",
    icon: "Coins",
    active: true,
  },
  {
    id: "telco",
    name: "Thẻ cào điện thoại",
    description: "Gửi mã thẻ Viettel, Vinaphone, Mobifone",
    icon: "CreditCard",
    active: true,
  },
];
