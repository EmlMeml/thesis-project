import React from "react";
import './../css/textSegmentAnimation.css';

interface TextSegmentProps {
    text?: string;
    minWidth?: number;
    maxWidth?: number;
    height?: number;
    isChanged?: boolean;
    changeNumber?: number;
    onClick?: (text: string) => void;
}



export const TextSegment: React.FC<TextSegmentProps> = ({
    text = "",
    minWidth = 76,
    maxWidth = 76,
    height = 48,
    isChanged,
    changeNumber,
    onClick,
}) => {
    const visibleText = text.trim() || "...";
    const charCount = visibleText.replace(/\s+/g, "").length;
    const isCurrentlyChanged = Boolean(isChanged);
    const normalizedValue = changeNumber !== undefined ? Math.min(10000, Math.max(1, changeNumber)) : 10;
    const animationDuration = Math.max(0.8, 3.2 - (normalizedValue / 10000) * 2.4);
    console.log('animationDuration:', animationDuration, 'changeNumber:', changeNumber);
    const width = Math.max(minWidth, Math.min(maxWidth, charCount * 8));
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