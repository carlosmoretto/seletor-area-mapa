// src/components/BuscadorEndereco.js
import React, { useState } from 'react';
import useExternalApi from '../hooks/useExternalApi';

function BuscadorEndereco({ onCoordenadasEncontradas }) {
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  
  const { loading, buscarCoordenadasPorEndereco } = useExternalApi();

  const handleBuscar = async (e) => {
    e.preventDefault();
    
    if (!busca.trim()) {
      alert('Digite um endereço para buscar');
      return;
    }

    const resultados = await buscarCoordenadasPorEndereco(busca);
    
    if (resultados && resultados.length > 0) {
      setResultados(resultados);
      setMostrarResultados(true);
    } else {
      alert('Nenhum endereço encontrado');
      setResultados([]);
      setMostrarResultados(false);
    }
  };

  const handleSelecionarEndereco = (endereco) => {
    onCoordenadasEncontradas({
      lat: endereco.lat,
      lng: endereco.lng
    });
    
    setBusca(endereco.nome);
    setMostrarResultados(false);
    setResultados([]);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '20px',
      marginBottom: '20px',
      position: 'relative'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '12px'
      }}>
        🔍 Buscar Endereço
      </h3>

      <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Ex: Rua XV de Novembro, Blumenau, SC"
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
          disabled={loading}
        />
        
        <button
          type="submit"
          disabled={loading || !busca.trim()}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: (loading || !busca.trim()) ? 0.6 : 1,
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {loading ? '⏳' : '🔍'}
        </button>
      </form>

      {/* Lista de resultados */}
      {mostrarResultados && resultados.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '20px',
          right: '20px',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          zIndex: 10,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {resultados.map((endereco, index) => (
            <div
              key={endereco.id || index}
              onClick={() => handleSelecionarEndereco(endereco)}
              style={{
                padding: '12px',
                borderBottom: index < resultados.length - 1 ? '1px solid #f3f4f6' : 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                📍 {endereco.endereco.cidade || 'Cidade não identificada'}
              </div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>
                {endereco.nome}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuscadorEndereco;