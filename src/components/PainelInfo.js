// src/components/PainelInfo.js
import React from 'react';

function PainelInfo({ coordenadas, area, selecionando, onSalvar }) {
  // 🛡️ Proteções para evitar erros
  const areaSegura = area || 0;
  const coordenadasSeguras = coordenadas || {};
  
  // Debug para ver o que está chegando
  console.log('🔍 PainelInfo - Props recebidas:', {
    coordenadas,
    area,
    selecionando,
    onSalvar: typeof onSalvar
  });

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '24px',
      marginBottom: '20px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '16px'
      }}>
        📊 Seleção Atual
      </h2>
      
      {selecionando ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <p>Selecionando área...</p>
        </div>
      ) : coordenadas ? (
        <div>
          {/* Coordenadas com proteção */}
          <InfoCard 
            titulo="📍 Coordenadas"
            conteudo={
              coordenadas.inicio && coordenadas.fim ? (
                // Formato novo (com início e fim)
                `Início: ${coordenadas.inicio.lat?.toFixed(6) || 'N/A'}, ${coordenadas.inicio.lng?.toFixed(6) || 'N/A'}\nFim: ${coordenadas.fim.lat?.toFixed(6) || 'N/A'}, ${coordenadas.fim.lng?.toFixed(6) || 'N/A'}`
              ) : coordenadas.lat && coordenadas.lng ? (
                // Formato antigo (só um ponto)
                `${coordenadas.lat.toFixed(6)}, ${coordenadas.lng.toFixed(6)}`
              ) : (
                'Coordenadas inválidas'
              )
            }
            cor="#dbeafe"
          />
          
          {/* Área com proteção */}
          <InfoCard 
            titulo="📐 Área"
            conteudo={`${areaSegura.toFixed(6)} km²`}
            cor="#dcfce7"
          />
          
          {/* Valor com proteção */}
          <InfoCard 
            titulo="💰 Valor Estimado"
            conteudo={`R$ ${(areaSegura * 100).toFixed(2)}`}
            cor="#f3e8ff"
          />

          {/* Botão para salvar via API */}
          {onSalvar && (
            <button
              onClick={onSalvar}
              style={{
                width: '100%',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              💾 Salvar Área
            </button>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <p>Clique no mapa para selecionar uma área</p>
        </div>
      )}
    </div>
  );
}

// Sub-componente para cards de informação com proteção
function InfoCard({ titulo, conteudo, cor }) {
  return (
    <div style={{
      backgroundColor: cor,
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '12px'
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        {titulo}
      </h3>
      <div style={{ fontSize: '16px', fontWeight: 'bold', whiteSpace: 'pre-line' }}>
        {conteudo || 'N/A'}
      </div>
    </div>
  );
}

export default PainelInfo;