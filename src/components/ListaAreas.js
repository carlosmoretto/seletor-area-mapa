// src/components/ListaAreas.js
import React from 'react';

function ListaAreas({ areas, onDeletar, loading }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '24px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '16px'
      }}>
        💾 Áreas Salvas ({areas.length})
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '24px' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Carregando...</p>
        </div>
      ) : areas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '24px' }}>📭</div>
          <p style={{ color: '#6b7280' }}>Nenhuma área salva ainda</p>
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {areas.map(area => (
            <AreaCard 
              key={area.id}
              area={area}
              onDeletar={onDeletar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AreaCard({ area, onDeletar }) {
  const handleDeletar = async () => {
    if (window.confirm(`Tem certeza que deseja deletar "${area.nome}"?`)) {
      const sucesso = await onDeletar(area.id);
      if (sucesso) {
        alert('✅ Área deletada com sucesso!');
      } else {
        alert('❌ Erro ao deletar área');
      }
    }
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '12px',
      marginBottom: '8px',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold',
            marginBottom: '4px',
            color: '#1f2937'
          }}>
            {area.nome}
          </h4>
          
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>
            📍 {area.coordenadas.lat.toFixed(4)}, {area.coordenadas.lng.toFixed(4)}
          </p>
          
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>
            📐 {area.area.toFixed(3)} km² • 💰 R$ {area.valor.toFixed(2)}
          </p>
          
          <p style={{ fontSize: '11px', color: '#9ca3af' }}>
            📅 {area.dataCriacao}
          </p>
        </div>
        
        <button
          onClick={handleDeletar}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ListaAreas;