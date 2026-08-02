import React from 'react';

interface AccteptBtnProps {
    onClick: () => void;
}

export const AccteptBtn: React.FC<AccteptBtnProps> = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                marginTop: 8,
                padding: '6px 12px',
                height: 40,
                border: 'none',
                borderRadius: 16,
                backgroundColor: '#2b4354',
                color: '#fff',
                cursor: 'pointer',
            }}
        >
            Accept Changes
        </button>
    );
};