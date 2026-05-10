import { useEffect } from "react";
import { useState } from "react";

const useDebounce = (value, delay = 700) => {
    const [debouncedVal, setDebouncedVal] = useState(value);

    useEffect(() => {
        if (Object.is(debouncedVal, value)) return;

        const timer = setTimeout(() => {
            setDebouncedVal(value);
        }, delay);

        return () => clearTimeout(timer);

    }, [value, delay]);

    return debouncedVal;
}

export default useDebounce;