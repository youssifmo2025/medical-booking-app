import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating the returned value until the user
 * stops typing for `delay` milliseconds.
 *
 * @param {*}      value  The raw value to debounce (e.g. search string)
 * @param {number} delay  Wait time in ms (default: 350ms)
 * @returns The debounced value
 */
const useDebounce = (value, delay = 350) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
