import React from 'react';
import { Descendant } from 'slate';
import { TextSegment } from './TextSegment';

interface ChangedSegment {
    paragraphKey?:string;
    text: string;
    changeNumber?: number;
}

interface TextNavProps {
    content?: Descendant[];
    onSegmentClick?: (text: string) => void;
    changedSegments?: ChangedSegment[];
}

export const TextNav: React.FC<TextNavProps> = ({ content = [], onSegmentClick, changedSegments = [] }) => {
    const segments = content.flatMap((node: any, index) => {
        if (!node || !Array.isArray(node.children)) {
            return [];
        }

        const text = node.children.filter(
            (child:any) => 
                typeof child?.text === 'string' && child.text.trim().length > 0
            ).map((child:any) => child.text).join('');
            if(!text.trim()){
                return [];
            }
    
        return [{
            text,
            paragraphKey: node.paragraphKey ?? `paragraphKey-${index}`,
        }];
    });
    const normalizedChangedSegments = (changedSegments || [])
        .map((segment) => ({
            paragraphKey: segment?.paragraphKey || '',
            text: segment?.text?.trim() || '',
            changeNumber: typeof segment?.changeNumber === 'number' ? segment.changeNumber : 0,
        }))
        .filter((segment)=> Boolean(segment.text) && Boolean(segment.paragraphKey));

    return (
        <div
            id="text-nav"
            data-testid="text-nav"
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'stretch',
                gap: '4px',
                paddingTop: '2px',
                overflowX: 'hidden',
                overflowY: 'hidden',
                whiteSpace: 'normal',
                width: '640px',
                height: '80px',
                minWidth: '80%',
                maxWidth: '80%',
            }}
        >
            {segments.length > 0 ? (
                segments.map((segment) => {
                    const textLength = segment.text.trim().length;
                    const changedSegment = normalizedChangedSegments.find((changed) => changed.paragraphKey === segment.paragraphKey);
                    const isSegmentChanged = Boolean(changedSegment);
                    const changeNumber = changedSegment?.changeNumber ?? 0;
                    const segmentWidth = Math.max(16, Math.min(160, 16 + textLength * 0.5));
                    return (
                        <TextSegment
                            key={segment.paragraphKey}
                            text={segment.text}
                            paragraphKey={segment.paragraphKey}
                            onClick={onSegmentClick}
                            isChanged={isSegmentChanged}
                            changeNumber={changeNumber}
                            height={64}
                            minWidth={segmentWidth}
                            maxWidth={1000000}
                        />
                    );
                })
            ) : (
                <p style={{ margin: 0, color: '#666' }}>No text segments yet.</p>
            )}
        
        </div>
    );
};   