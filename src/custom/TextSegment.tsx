import React from "react";
import './../css/textSegmentAnimation.css';

interface TextSegmentProps {
    text?: string;
    minWidth?: number;
    maxWidth?: number;
    height?: number;
    isChanged?: boolean;
    onClick?: (text: string) => void;
}



export const TextSegment: React.FC<TextSegmentProps> = ({
    text = "",
    minWidth = 8,
    height = 64,
    maxWidth = 260,
    isChanged,
    onClick,
}) => {
    const visibleText = text.trim() || "...";
    const charCount = visibleText.replace(/\s+/g, "").length;
    const isCurrentlyChanged = Boolean(isChanged);

    const width = Math.min(maxWidth, Math.max(minWidth, charCount * 7 + 24));

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
                height
            }}
        >
            <div className="reg t-1"></div>
            <div className="reg t-2"></div>
            <div className="reg t-3"></div>
        </div>
    );
};