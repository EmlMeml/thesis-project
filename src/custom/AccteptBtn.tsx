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
                marginTop: 32,
                padding: '6px 12px',
                marginLeft: 32,
                height: 40,
                border: 'none',
                borderRadius: 16,
                backgroundColor: '#2b4354',
                color: '#fff',
                cursor: 'pointer',
                width: 160,
            }}
        >
            Accept Changes
        </button>
    );
};