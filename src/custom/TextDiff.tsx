import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChangeObject, diffWords } from 'diff';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './../css/lineDiffAnimation.css';

interface TextDiffProps {
  oldText: string;
  newText: string;
  paragraphKey?: string;
  onResolvedTextChange?: (paragraphKey: string, resolvedText: string, pendingCount: number) => void;
}

type ChangeStatus = 'pending' | 'accepted' | 'rejected';

type DiffGroup = {
  id: number;
  removed?: ChangeObject<string>;
  added?: ChangeObject<string>;
  original?: string;
};

type ParagraphDiff = {
  id: number;
  groups: DiffGroup[];
};

export const InlineTextDiff: React.FC<TextDiffProps> = ({ oldText, newText, paragraphKey, onResolvedTextChange }) => {
  const differences = diffWords(oldText, newText);
  const [statuses, setStatuses] = useState<Record<number, ChangeStatus>>({});
  const [activeParagraphId, setActiveParagraphId] = useState<number>(0);

  const createParagraphGroups = (parts: ChangeObject<string>[], startGroupId: number): { groups: DiffGroup[]; nextGroupId: number } => {
    const groups: DiffGroup[] = [];
    let groupId = startGroupId;

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      const nextPart = parts[index + 1];

      if (part.removed && nextPart?.added) {
        groups.push({ id: groupId++, removed: part, added: nextPart });
        index += 1;
        continue;
      }

      if (part.removed || part.added) {
        groups.push({
          id: groupId++,
          removed: part.removed ? part : undefined,
          added: part.added ? part : undefined,
        });
        continue;
      }

      groups.push({ id: groupId++, original: part.value });
    }

    return { groups, nextGroupId: groupId };
  };

  const paragraphDiffs = useMemo<ParagraphDiff[]>(() => {
    const paragraphs: ParagraphDiff[] = [];
    let currentParts: ChangeObject<string>[] = [];
    let paragraphId = 0;
    let nextGroupId = 0;

    differences.forEach((part) => {
      const segments = part.value.split(/(\n)/);
      segments.forEach((segment) => {
        if (segment === '\n') {
          const result = createParagraphGroups(currentParts, nextGroupId);
          paragraphs.push({ id: paragraphId++, groups: result.groups });
          nextGroupId = result.nextGroupId;
          currentParts = [];
        } else if (segment.length > 0) {
          currentParts.push({ ...part, value: segment } as ChangeObject<string>);
        }
      });
    });

    if (currentParts.length > 0) {
      const result = createParagraphGroups(currentParts, nextGroupId);
      paragraphs.push({ id: paragraphId++, groups: result.groups });
      nextGroupId = result.nextGroupId;
    }

    return paragraphs;
  }, [differences]);

  const paragraphRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const element = paragraphRefs.current[activeParagraphId];
    if (element) {
      //element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeParagraphId]);

  const resolveTextForParagraph = (paragraph: ParagraphDiff, statusesSnapshot: Record<number, ChangeStatus>) =>
    paragraph.groups
      .map((group) => {
        const status = statusesSnapshot[group.id] ?? 'pending';

        if (group.original !== undefined) {
          return group.original;
        }

        if (group.removed && group.added) {
          return status === 'rejected' ? group.removed.value : group.added.value;
        }

        if (group.added) {
          return status === 'rejected' ? '' : group.added.value;
        }

        if (group.removed) {
          return status === 'rejected' ? group.removed.value : '';
        }

        return '';
      })
      .join('');

  const countPendingCharacters = (paragraph: ParagraphDiff, statusesSnapshot: Record<number, ChangeStatus>) =>
    paragraph.groups.reduce((count, group) => {
      const status = statusesSnapshot[group.id] ?? 'pending';
      if (status !== 'pending') {
        return count;
      }

      if (group.removed && group.added) {
        return count + Math.max(group.removed.value.length, group.added.value.length);
      }

      return count + (group.removed?.value.length ?? group.added?.value.length ?? 0);
    }, 0);

  const renderAddedText = (text?: string, animate = true) =>
    text?.split('').map((char, index) => (
      <span
        key={`added-char-${index}`}
        style={{
          display: 'inline-block',
          position: 'relative',
          animation: animate ? undefined : 'none',
          animationDelay: animate ? `${index * 0.08}s` : undefined,
        }}
      >
        {char}
      </span>
    ));

  const handleAccept = (groupId: number) => {
    setStatuses((prev) => {
      const nextStatuses: Record<number, ChangeStatus> = { ...prev, [groupId]: 'accepted' };
      const paragraph = paragraphDiffs.find((paragraphItem) =>
        paragraphItem.groups.some((group) => group.id === groupId)
      );
      if (paragraph && paragraphKey && onResolvedTextChange) {
        onResolvedTextChange(
          paragraphKey,
          resolveTextForParagraph(paragraph, nextStatuses),
          countPendingCharacters(paragraph, nextStatuses),
        );
      }
      return nextStatuses;
    });
  };

  const handleReject = (groupId: number) => {
    setStatuses((prev) => {
      const nextStatuses: Record<number, ChangeStatus> = { ...prev, [groupId]: 'rejected' };
      const paragraph = paragraphDiffs.find((paragraphItem) =>
        paragraphItem.groups.some((group) => group.id === groupId)
      );
      if (paragraph && paragraphKey && onResolvedTextChange) {
        onResolvedTextChange(
          paragraphKey,
          resolveTextForParagraph(paragraph, nextStatuses),
          countPendingCharacters(paragraph, nextStatuses),
        );
      }
      return nextStatuses;
    });
  };

  const findNextPendingParagraph = (startIndex: number, statusesSnapshot: Record<number, ChangeStatus>) => {
    const hasPendingChanges = (paragraph: ParagraphDiff) =>
      paragraph.groups.some((group) => {
        const status = statusesSnapshot[group.id] ?? 'pending';
        return (group.removed || group.added) && status === 'pending';
      });

    for (let index = startIndex + 1; index < paragraphDiffs.length; index += 1) {
      if (hasPendingChanges(paragraphDiffs[index])) {
        return index;
      }
    }

    for (let index = 0; index < paragraphDiffs.length; index += 1) {
      if (hasPendingChanges(paragraphDiffs[index])) {
        return index;
      }
    }

    return undefined;
  };

  const handleAcceptParagraph = (paragraph: ParagraphDiff | undefined) => {
    if (!paragraph) return;
    const acceptedGroups = paragraph.groups.reduce<Record<number, ChangeStatus>>((acc, group) => {
      if (group.removed || group.added) {
        acc[group.id] = 'accepted';
      }
      return acc;
    }, {});

    setStatuses((prev) => {
      const nextStatuses: Record<number, ChangeStatus> = { ...prev, ...acceptedGroups };
      if (paragraphKey && onResolvedTextChange) {
        onResolvedTextChange(
          paragraphKey,
          resolveTextForParagraph(paragraph, nextStatuses),
          countPendingCharacters(paragraph, nextStatuses),
        );
      }
      const nextParagraphId = findNextPendingParagraph(activeParagraphId, nextStatuses);
      if (nextParagraphId !== undefined) {
        setActiveParagraphId(nextParagraphId);
      }
      return nextStatuses;
    });
  };

  const handleRejectParagraph = (paragraph: ParagraphDiff | undefined) => {
    if (!paragraph) return;
  
  const rejectedGroups = paragraph.groups.reduce<Record<number, ChangeStatus>>((acc, group) => {
      if (group.removed || group.added) {
        acc[group.id] = 'rejected';
      }
      return acc;
    }, {});

    setStatuses((prev) => { 
      const nextStatuses: Record<number, ChangeStatus> = { ...prev, ...rejectedGroups };
      if (paragraphKey && onResolvedTextChange) {
        onResolvedTextChange(
          paragraphKey,
          resolveTextForParagraph(paragraph, nextStatuses),
          countPendingCharacters(paragraph, nextStatuses),
        );
      }
      const nextParagraphId = findNextPendingParagraph(activeParagraphId, nextStatuses);
      if (nextParagraphId !== undefined) {
        setActiveParagraphId(nextParagraphId);
      }
      return nextStatuses;
    });
  };

  const selectedParagraph = paragraphDiffs[activeParagraphId] ?? paragraphDiffs[0];
  const pendingGroupCount = selectedParagraph
    ? selectedParagraph.groups.filter((group) => {
        const status = statuses[group.id] ?? 'pending';
        return (group.removed || group.added) && status === 'pending';
      }).length
    : 0;

  const paragraphHasPendingChanges = (paragraph: ParagraphDiff) =>
    paragraph.groups.some((group) => {
      const status = statuses[group.id] ?? 'pending';
      return (group.removed || group.added) && status === 'pending';
    });

  useEffect(() => {
    if (!paragraphDiffs.length) {
      return;
    }

    const currentParagraph = paragraphDiffs[activeParagraphId];
    const hasCurrentPending = currentParagraph && paragraphHasPendingChanges(currentParagraph);
    if (hasCurrentPending) {
      return;
    }

    const nextPendingIndex = paragraphDiffs.findIndex((paragraph) => paragraphHasPendingChanges(paragraph));
    if (nextPendingIndex !== -1 && nextPendingIndex !== activeParagraphId) {
      setActiveParagraphId(nextPendingIndex);
    }
  }, [paragraphDiffs, statuses, activeParagraphId]);

  return (
    <div>
      {pendingGroupCount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => handleAcceptParagraph(selectedParagraph)}
          >
            Accept all changes
          </Button>

          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleRejectParagraph(selectedParagraph)}
          >
            Reject all changes
          </Button>
        </div>
        
      )}

      {paragraphDiffs.length > 0 ? (
        paragraphDiffs.map((paragraph, paragraphIndex) => {
          const paragraphStatus = paragraphIndex === activeParagraphId;
          const isParagraphPending = paragraphHasPendingChanges(paragraph);

          return (
            <div
              key={`paragraph-${paragraph.id}`}
              ref={(el) => {
                paragraphRefs.current[paragraph.id] = el;
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {!paragraphStatus && isParagraphPending ? (
                  <span>{resolveTextForParagraph(paragraph, statuses)}</span>
                ) : (
                  paragraph.groups.map((group) => {
                    const status = statuses[group.id] ?? 'pending';

                    if (group.original !== undefined) {
                      return (
                        <span key={`original-${group.id}`}>{group.original}</span>
                      );
                    }

                    const showRemoved = Boolean(group.removed && status === 'pending');
                    const showAdded = Boolean(group.added && status !== 'rejected');
                    const showRejectedOriginal = Boolean(group.removed && status === 'rejected');

                    return (
                      <span
                        key={`group-${group.id}`}
                        style={{ display: 'inline', verticalAlign: 'baseline' }}
                      >
                        {showRemoved && (
                          <del
                            style={{
                              color: '#d32f2f',
                              backgroundColor: '#ffebee',
                              padding: '0 2px',
                              display: 'inline',
                              position: 'relative',
                              textDecoration: 'none',
                            }}
                          >
                            {group.removed?.value}
                          </del>
                        )}

                        {showRejectedOriginal && (
                          <span style={{ padding: '0 2px', display: 'inline' }}>{group.removed?.value}</span>
                        )}

                        {showAdded && (
                          <ins className="wave"
                            style={{
                              color: status === 'accepted' ? '#000' : '#388e3c',
                              backgroundColor: status === 'accepted' ? 'transparent' : '#e8f5e9',
                              textDecoration: 'none',
                              padding: '0 2px',
                              display: 'inline',
                            }}
                          >
                            {renderAddedText(group.added?.value, status === 'pending')}
                          </ins>
                        )}

                        {status === 'pending' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', whiteSpace: 'nowrap', marginLeft: '0.35rem' }}>
                            <Chip
                              label="Accept"
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleAccept(group.id)}
                              icon={<CheckIcon />}
                              style={{ minWidth: '56px', padding: '0 6px' }}
                            />
                            <Chip
                              label="Reject"
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleReject(group.id)}
                              icon={<CloseIcon />}
                              style={{ minWidth: '56px', padding: '0 6px' }}
                            />
                          </span>
                        )}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ color: '#777' }}>No paragraph changes found.</div>
      )}
    </div>
  );
};
