import React from "react";
import './../css/textSegmentAnimation.css';

interface TextSegmentProps {
    text?: string;
    paragraphKey?: string;
    minWidth?: number;
    maxWidth?: number;
    height?: number;
    isChanged?: boolean;
    changeNumber?: number;
    onClick?: (paragraphKey: string) => void;
}



export const TextSegment: React.FC<TextSegmentProps> = ({
    text = "",
    paragraphKey="",
    minWidth = 24,
    maxWidth = 1000000,
    height = 64,
    isChanged,
    changeNumber,
    onClick,
}) => {

    const visibleText = text.trim() || "...";
    const charCount = visibleText.replace(/\s+/g, "").length;
    const isCurrentlyChanged = Boolean(isChanged);
    const normalizedValue = changeNumber !== undefined ? Math.min(10000, Math.max(0, changeNumber)) : 10;
    const progress = normalizedValue / 100;
    const animationDuration = 0.8 +  Math.pow(1 - progress, 2) * 2.4;
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
                if(paragraphKey){
                    onClick?.(paragraphKey);
                }
                
                event.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if(paragraphKey){
                    onClick?.(paragraphKey);
                    }
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