import React from 'react';
import { Descendant } from 'slate';
import { TextSegment } from './TextSegment.tsx';

interface TextNavProps {
    content?: Descendant[];
    onSegmentClick?: (text: string) => void;
}

export const TextNav: React.FC<TextNavProps> = ({ content = [], onSegmentClick }) => {
    const segments = content.flatMap((node: any) => {
        if (!node || !Array.isArray(node.children)) {
            return [];
        }

        return node.children
            .filter((child: any) => typeof child?.text === 'string' && child.text.trim().length > 0)
            .map((child: any) => child.text);
    });

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
                segments.map((text, index) => (
                    <TextSegment key={`${text}-${index}`} text={text} onClick={onSegmentClick} isChanged={true} />
                ))
            ) : (
                <p style={{ margin: 0, color: '#666' }}>No text segments yet.</p>
            )}
        </div>
    );
};   