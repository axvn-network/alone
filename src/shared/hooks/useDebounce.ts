/**
 * src/hooks/useDebounce.ts
 *
 * Trả về giá trị debounced — chỉ update sau khi người dùng ngừng gõ `delay` ms.
 * Dùng cho search input để tránh gọi API mỗi keystroke.
 *
 * @example
 *   const debouncedSearch = useDebounce(search, 300);
 *   useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
