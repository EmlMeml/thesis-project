import React, { useMemo, useState } from 'react';
import { ChangeObject, diffWords } from 'diff';
import Chip from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface TextDiffProps {
  oldText: string;
  newText: string;
}

type ChangeStatus = 'pending' | 'accepted' | 'rejected';

type DiffGroup = {
  id: number;
  removed?: ChangeObject<string>;
  added?: ChangeObject<string>;
  original?: string;
};

export const InlineTextDiff: React.FC<TextDiffProps> = ({ oldText, newText }) => {
  const differences = diffWords(oldText, newText);
  const [statuses, setStatuses] = useState<Record<number, ChangeStatus>>({});

  const groupedDiffs = useMemo<DiffGroup[]>(() => {
    const groups: DiffGroup[] = [];
    let nextGroupId = 0;

    for (let index = 0; index < differences.length; index += 1) {
      const part = differences[index];
      const nextPart = differences[index + 1];

      if (part.removed && nextPart?.added) {
        groups.push({ id: nextGroupId++, removed: part, added: nextPart });
        index += 1;
        continue;
      }

      if (part.removed || part.added) {
        groups.push({
          id: nextGroupId++,
          removed: part.removed ? part : undefined,
          added: part.added ? part : undefined,
        });
        continue;
      }

      groups.push({ id: nextGroupId++, original: part.value });
    }

    return groups;
  }, [differences]);

  const handleAccept = (groupId: number) => {
    setStatuses((prev) => ({ ...prev, [groupId]: 'accepted' }));
  };

  const handleReject = (groupId: number) => {
    setStatuses((prev) => ({ ...prev, [groupId]: 'rejected' }));
  };

  return (
    <span style={{ fontFamily: 'sans-serif', lineHeight: '1.5' }}>
      {groupedDiffs.map((group) => {
        const status = statuses[group.id] ?? 'pending';

        if (group.original !== undefined) {
          return (
            <span key={`original-${group.id}`}>
              {group.original}
            </span>
          );
        }

        const showRemoved = Boolean(group.removed && status === 'pending');
        const showAdded = Boolean(group.added && status !== 'rejected');
        const showRejectedOriginal = Boolean(group.removed && status === 'rejected');

        return (
          <span
            key={`group-${group.id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'pre-wrap' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
              {showRemoved && (
                <del
                  style={{
                    color: '#d32f2f',
                    backgroundColor: '#ffebee',
                    textDecoration: 'line-through',
                    padding: '0 2px',
                  }}
                >
                  {group.removed?.value}
                </del>
              )}

              {showRejectedOriginal && (
                <span style={{ padding: '0 2px' }}>{group.removed?.value}</span>
              )}

              {showAdded && (
                <ins
                  style={{
                    color: status === 'accepted' ? '#000' : '#388e3c',
                    backgroundColor: status === 'accepted' ? 'transparent' : '#e8f5e9',
                    textDecoration: 'none',
                    padding: '0 2px',
                  }}
                >
                  {group.added?.value}
                </ins>
              )}
            </span>

            {status === 'pending' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Chip
                  label="Accept"
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => handleAccept(group.id)}
                  icon={<CheckIcon />}
                />
                <Chip
                  label="Reject"
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleReject(group.id)}
                  icon={<CloseIcon />}
                />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};
