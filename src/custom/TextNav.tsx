import React from 'react';
import { Descendant } from 'slate';
import { TextSegment } from './TextSegment.tsx';

interface TextNavProps {
    content?: Descendant[];
    onSegmentClick?: (text: string) => void;
    changedTexts?: string[];
}

export const TextNav: React.FC<TextNavProps> = ({ content = [], onSegmentClick, changedTexts = [] }) => {
    const segments = content.flatMap((node: any) => {
        if (!node || !Array.isArray(node.children)) {
            return [];
        }

        return node.children
            .filter((child: any) => typeof child?.text === 'string' && child.text.trim().length > 0)
            .map((child: any) => child.text);
    });

    const normalizedChangedTexts = (changedTexts || [])
        .map((text) => text?.trim())
        .filter((text): text is string => Boolean(text));

    return (
        <div
            id="text-nav"
            style={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'flex-start',
                gap: '4px',
                overflowX: 'auto',
                overflowY: 'hidden',
                whiteSpace: 'nowrap',
            }}
        >
            {segments.length > 0 ? (
                segments.map((text, index) => {
                    const textLength = text.trim().length;
                    const value = (textLength * 4)/1000; // Normalize value to a range of 10-100 and divide by 2 for scaling
                    const isSegmentChanged = normalizedChangedTexts.includes(text.trim());
                    return (
                        <TextSegment
                            key={`${text}-${index}`}
                            text={text}
                            onClick={onSegmentClick}
                            isChanged={isSegmentChanged}
                            value={value}
                        />
                    );
                })
            ) : (
                <p style={{ margin: 0, color: '#666' }}>No text segments yet.</p>
            )}
        </div>
    );
};   