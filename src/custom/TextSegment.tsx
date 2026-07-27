import React from "react";
import './../css/textSegmentAnimation.css';

interface TextSegmentProps {
    text?: string;
    minWidth?: number;
    maxWidth?: number;
    height?: number;
    isChanged?: boolean;
    value?: number;
    onClick?: (text: string) => void;
}



export const TextSegment: React.FC<TextSegmentProps> = ({
    text = "",
    minWidth = 16,
    height = 64,
    isChanged,
    value,
    onClick,
}) => {
    const visibleText = text.trim() || "...";
    const charCount = visibleText.replace(/\s+/g, "").length;
    const isCurrentlyChanged = Boolean(isChanged);
    const normalizedValue = value !== undefined ? Math.min(10000, Math.max(1, value)) : 10; // Default to 1 if value is undefined
    const animationDuration = Math.max(0.8, 3.2 - (normalizedValue / 100) * 2.4);

    const width = Math.min(charCount, Math.max(minWidth, charCount * 8)); 
    const layerStyle = (delay: string) => ({
        ['--ripple-delay' as any]: delay,
    } as React.CSSProperties);

    function scrollToSegment(segmentText: string) {
        const segmentElement = document.getElementById("text-segment");
        console.log("Scrolling to segment with length:", segmentText.length);
        if (segmentElement) {
            segmentElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    return (
        <div
            id="text-segment"
            className={`text-segment${isCurrentlyChanged ? " changed" : ""}`}
            onClick={(event) => {
                onClick?.(visibleText);
                event.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.(visibleText);
                }
            }}
            style={{
                width,
                height,
                ['--ripple-duration' as any]: `${animationDuration}s`,
            } as React.CSSProperties}
        >
            <div className="reg t-1" style={layerStyle('0s')}></div>
            <div className="reg t-2" style={layerStyle('0.6s')}></div>
            <div className="reg t-3" style={layerStyle('1.2s')}></div>
        </div>
    );
};