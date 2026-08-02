import React from 'react';
import { Descendant } from 'slate';
import { TextSegment } from './TextSegment.tsx';

interface ChangedSegment {
    text: string;
    changeNumber?: number;
}

interface TextNavProps {
    content?: Descendant[];
    onSegmentClick?: (text: string) => void;
    changedTexts?: string[];
    changedSegments?: ChangedSegment[];
}

export const TextNav: React.FC<TextNavProps> = ({ content = [], onSegmentClick, changedTexts = [], changedSegments = [] }) => {
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

    const normalizedChangedSegments = (changedSegments || [])
        .map((segment) => ({
            text: segment?.text?.trim() || '',
            changeNumber: typeof segment?.changeNumber === 'number' ? segment.changeNumber : 0,
        }))
        .filter((segment): segment is ChangedSegment & { text: string; changeNumber: number } => Boolean(segment.text));

    return (
        <div
            id="text-nav"
            data-testid="text-nav"
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                alignItems: 'stretch',
                gap: '4px',
                overflowX: 'hidden',
                overflowY: 'auto',
                whiteSpace: 'normal',
                width: '92px',
                minWidth: '92px',
                maxWidth: '92px',
                height: '640px',
                minHeight: '100%',
                maxHeight: '100%',
            }}
        >
            {segments.length > 0 ? (
                segments.map((text, index) => {
                    const textLength = text.trim().length;
                    const changedSegment = normalizedChangedSegments.find((segment) => segment.text === text.trim());
                    const isSegmentChanged = normalizedChangedTexts.includes(text.trim()) || Boolean(changedSegment);
                    const changeNumber = changedSegment?.changeNumber ?? 0;
                    const segmentHeight = Math.max(16, Math.min(160, 16 + textLength * 0.5));
                    return (
                        <TextSegment
                            key={`${text}-${index}`}
                            text={text}
                            onClick={onSegmentClick}
                            isChanged={isSegmentChanged}
                            changeNumber={changeNumber}
                            height={segmentHeight}
                            minWidth={74}
                            maxWidth={74}
                        />
                    );
                })
            ) : (
                <p style={{ margin: 0, color: '#666' }}>No text segments yet.</p>
            )}
        
        </div>
    );
};   