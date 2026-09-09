
import { useState, useEffect } from "react";

export default function useDebounce(value, delay) {
    const [debouncedValue, setDebounceValue] = useState("");

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounceValue(value)
        }, delay);

        return () => {
            clearTimeout(timerId);
        }
    }, [value, delay])

    return {
        debouncedValue,
    }

}