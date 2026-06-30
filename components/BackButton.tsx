interface BackButtonProps {
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
        <button className="wct-back-button" onClick={onClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Stories
            <style jsx>{`
                .wct-back-button {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 12px 20px;
                    background: none;
                    border: none;
                    border-bottom: 1px solid #e5e7eb;
                    cursor: pointer;
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #0d7377;
                    width: 100%;
                    transition: background 0.2s;
                    font-family: inherit;
                }
                
                .wct-back-button:hover {
                    background: #f0fdfa;
                }`}
            </style>
        </button>
    )}
export default BackButton