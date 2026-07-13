import React from "react";

interface TextSegmentProps {
    text?: string;
    minWidth?: number;
    maxWidth?: number;
    height?: number;
    onClick?: (text: string) => void;
}

export const TextSegment: React.FC<TextSegmentProps> = ({
    text = "",
    minWidth = 8,
    height = 64,
    maxWidth = 260,
    onClick,
}) => {
    const visibleText = text.trim() || "...";
    const charCount = visibleText.replace(/\s+/g, "").length;

    const width = Math.min(maxWidth, Math.max(minWidth, charCount * 7 + 24));

    return (
        <div
            id="text-segment"
            className="text-segment"
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
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width,
                height,
                padding: "6px 8px",
                margin: "2px",
                borderRadius: "8px",
                backgroundColor: "#e8f0f7",
                border: "1px solid #cad9e4",
                boxSizing: "border-box",
                whiteSpace: "pre-wrap",
                overflow: "hidden",
                fontSize: "14px",
                lineHeight: 1.3,
                cursor: "pointer",
                userSelect: "none",
            }}
        >
        </div>
    );
};