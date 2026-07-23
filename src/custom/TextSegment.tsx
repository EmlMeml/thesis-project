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
    minWidth = 8,
    height = 64,
    maxWidth = 260,
    isChanged,
    value = 0,
    onClick,
}) => {
    const visibleText = text.trim() || "...";
    const charCount = visibleText.replace(/\s+/g, "").length;
    const isCurrentlyChanged = Boolean(isChanged);
    const normalizedValue = Math.min(100, Math.max(0, value));
    const animationDuration = Math.max(0.8, 3.2 - (normalizedValue / 100) * 2.4);

    const width = Math.min(maxWidth, Math.max(minWidth, charCount * 7 + 24));
    const layerStyle = (delay: string) => ({
        ['--ripple-delay' as any]: delay,
    } as React.CSSProperties);

    return (
        <div
            id="text-segment"
            className={`text-segment${isCurrentlyChanged ? " changed" : ""}`}
            onClick={() => onClick?.(visibleText)}
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