import { useState, useEffect } from "react";

/**
 * useDebounce – trả về giá trị đã được debounce sau `delay` ms.
 * @param value  Giá trị cần debounce (thường là search string hoặc filter)
 * @param delay  Thời gian delay (mặc định 350ms)
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
