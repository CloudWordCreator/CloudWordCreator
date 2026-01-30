import { useEffect } from 'react';

export const usePageStyles = (hrefs) => {
    useEffect(() => {
        const links = hrefs.map(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            // Determine media type based on filename for crude heuristic, or pass in objects
            // But looking at templates:
            // paper-setup.css -> print
            // *-print-setup.css -> print
            // *_style.css -> screen
            if (href.includes('print-setup') || href.includes('paper-setup')) {
                link.media = 'print';
            } else {
                link.media = 'screen';
            }
            document.head.appendChild(link);
            return link;
        });

        return () => {
            links.forEach(link => {
                document.head.removeChild(link);
            });
        };
    }, []); // Empty dependency array means this runs once on mount
};
