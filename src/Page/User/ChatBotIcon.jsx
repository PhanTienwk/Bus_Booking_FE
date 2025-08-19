import React from 'react';

const ChatbotIcon = ({ onClick }) => {
  return (
    <div
      className="chatbot-icon"
      onClick={onClick}
      style={{
        width: '60px',
        height: '60px',
        background: '#007bff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#fff',
        fontSize: '24px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      💬
    </div>
  );
};

export default ChatbotIcon;