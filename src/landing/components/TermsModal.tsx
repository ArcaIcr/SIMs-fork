import React from 'react';

interface TermsModalProps {
  open: boolean;
  onAgree: () => void;
  onDisagree: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ open, onAgree, onDisagree }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, overflow: 'hidden', width: 320, maxWidth: '90vw', 
        boxShadow: '0 2px 16px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Please note</h2>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: '#333', marginBottom: 16, padding: '0 8px' }}>
            I have read and agree <span style={{ color: '#1e3a8a', fontWeight: 600 }}>"Terms and Condition"</span> by registering.
          </p>
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid #e5e5e5' }}>
          <button 
            onClick={onDisagree} 
            style={{ 
              flex: 1, padding: '16px 0', border: 'none', background: '#fff', 
              borderRight: '1px solid #e5e5e5', fontSize: 16, fontWeight: 600, color: '#777' 
            }}
          >
            Disagree
          </button>
          <button 
            onClick={onAgree} 
            style={{ 
              flex: 1, padding: '16px 0', border: 'none', background: '#fff', 
              fontSize: 16, fontWeight: 700, color: '#000' 
            }}
          >
            Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
