// src/components/PainelApiExterna.js
import React from 'react';
import useExternalApi from '../hooks/useExternalApi';

function PainelApiExterna({ coordenadas }) {
  const {
    loading,
    error,
    endereco,
    clima,
    localizacaoUsuario,
    infoPais,
    buscarEnderecoPorCoordenadas,
    obterLocalizacaoUsuario
  } = useExternalApi();

  // Buscar dados quando coordenadas mudarem
  React.useEffect(() => {
    if (coordenadas) {
      buscarEnderecoPorCoordenadas(coordenadas.lat, coordenadas.lng);
    }
  }, [coordenadas]);

  const handleLocalizarUsuario = async () => {
    await obterLocalizacaoUsuario();
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '24px',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          🌐 APIs Externas
        </h2>
        
        <button
          onClick={handleLocalizarUsuario}
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          📍 Minha Localização
        </button>
      </div>

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#fef3c7',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
          <p style={{ color: '#92400e', fontSize: '14px' }}>
            Buscando dados externos...
          </p>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#fecaca',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#dc2626', fontSize: '14px' }}>
            ❌ {error}
          </p>
        </div>
      )}

      {!coordenadas && !localizacaoUsuario ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 0',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌐</div>
          <p>Selecione uma área ou use sua localização</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Endereço */}
          {endereco && (
            <ApiCard
              titulo="📍 Endereço"
              conteudo={
                <div>
                  <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {endereco.detalhes.rua} {endereco.detalhes.numero}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    {endereco.detalhes.bairro}, {endereco.detalhes.cidade} - {endereco.detalhes.estado}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    CEP: {endereco.detalhes.cep || 'N/A'}
                  </p>
                </div>
              }
              cor="#dbeafe"
            />
          )}

          {/* Clima */}
          {clima && (
            <ApiCard
              titulo="🌤️ Clima Atual"
              conteudo={
                <div>
                  <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {clima.temperatura}°C - {clima.descricao}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span>💧 {clima.umidade}%</span>
                    <span>💨 {clima.vento} km/h</span>
                    <span>🌡️ {clima.sensacao}°C</span>
                  </div>
                </div>
              }
              cor="#dcfce7"
            />
          )}

          {/* Localização do usuário */}
          {localizacaoUsuario && (
            <ApiCard
              titulo="📍 Sua Localização"
              conteudo={
                <div>
                  <p style={{ fontSize: '12px', marginBottom: '4px' }}>
                    Lat: {localizacaoUsuario.lat.toFixed(6)}
                  </p>
                  <p style={{ fontSize: '12px', marginBottom: '4px' }}>
                    Lng: {localizacaoUsuario.lng.toFixed(6)}
                  </p>
                  <p style={{ fontSize: '11px', color: '#6b7280' }}>
                    Precisão: ±{Math.round(localizacaoUsuario.precisao)}m
                  </p>
                </div>
              }
              cor="#f3e8ff"
            />
          )}

          {/* Informações do país */}
          {infoPais && (
            <ApiCard
              titulo="🏢 País"
              conteudo={
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <img 
                      src={infoPais.bandeira} 
                      alt={infoPais.nome}
                      style={{ width: '20px', height: '15px', marginRight: '8px' }}
                    />
                    <span style={{ fontWeight: 'bold' }}>{infoPais.nome}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                    Capital: {infoPais.capital}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                    População: {infoPais.populacao.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    Moeda: {infoPais.moedas?.[0]}
                  </p>
                </div>
              }
              cor="#fef3c7"
            />
          )}
        </div>
      )}
    </div>
  );
}

// Componente para cards da API
function ApiCard({ titulo, conteudo, cor }) {
  return (
    <div style={{
      backgroundColor: cor,
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid rgba(0,0,0,0.1)'
    }}>
      <h4 style={{
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#1f2937'
      }}>
        {titulo}
      </h4>
      {typeof conteudo === 'string' ? (
        <p style={{ fontSize: '14px' }}>{conteudo}</p>
      ) : (
        conteudo
      )}
    </div>
  );
}

export default PainelApiExterna;