import React from 'react';

function Header({ titulo, subtitulo }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '30px'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '10px'
      }}>
        {titulo}
      </h1>
      
      {subtitulo && (
        <p style={{
          color: '#6b7280',
          fontSize: '16px'
        }}>
          {subtitulo}
        </p>
      )}
    </div>
  );
}

export default Header;