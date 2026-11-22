import { useEffect, useState } from "react";

function useMediaQuery(query: string) {
    const [ matches, setMatches ] = useState(
        () => window.matchMedia(query).matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const onChange = () => setMatches(mediaQuery.matches);

        onChange();
        mediaQuery.addEventListener("change", onChange);

        return () => mediaQuery.removeEventListener("change", onChange);
    }, [query]);

    return matches;
}

export default useMediaQuery;
