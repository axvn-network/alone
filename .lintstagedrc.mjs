// lint-staged config
// tsc không nhận file list trực tiếp → dùng hàm () => "tsc --noEmit" để chạy toàn project
/** @type {import('lint-staged').Config} */
export default {
  "*.{js,ts,jsx,tsx}": [
    "eslint --fix",
    () => "tsc --noEmit",
  ],
  "*.{json,md,css,scss}": [
    "npx --no prettier --write",
  ],
};
