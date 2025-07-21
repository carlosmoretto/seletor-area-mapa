import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
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
          🗺️ Seletor de Área no Mapa
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '20px'
        }}>
          Aplicação React funcionando no EasyPanel! ✅
        </p>
        
        <div style={{
          backgroundColor: '#dbeafe',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #93c5fd'
        }}>
          <h2 style={{
            fontSize: '18px',
            color: '#1e40af',
            marginBottom: '8px'
          }}>
            🎉 Status: FUNCIONANDO
          </h2>
          <p style={{
            color: '#1d4ed8',
            fontSize: '14px'
          }}>
            React carregado com sucesso! Pronto para adicionar o mapa.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;