// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import MapaReal from './components/MapaReal';
import PainelInfo from './components/PainelInfo';
import ListaAreas from './components/ListaAreas';
import PainelApiExterna from './components/PainelApiExterna';
import BuscadorEndereco from './components/BuscadorEndereco';
import useApi from './hooks/useApi';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [coordenadas, setCoordenadas] = useState(null);
  const [area, setArea] = useState(0);
  const [selecionando, setSelecionando] = useState(false);
  
  const { areas, loading, error, salvarArea, deletarArea } = useApi();

  const handleSalvarArea = async () => {
    if (!coordenadas || !area) {
      alert('Selecione uma área primeiro!');
      return;
    }

    const nomeArea = prompt('Nome da área:');
    if (!nomeArea) return;

    const novaArea = {
      nome: nomeArea,
      coordenadas: coordenadas,
      area: area,
      valor: area * 100
    };

    const resultado = await salvarArea(novaArea);
    
    if (resultado) {
      alert('✅ Área salva com sucesso!');
      // Não limpar coordenadas para manter seleção visível
    } else {
      alert('❌ Erro ao salvar área');
    }
  };

  // Função para quando endereço for encontrado na busca
  const handleCoordenadasEncontradas = (novasCoordenadas) => {
    if (window.irParaLocalizacao) {
      window.irParaLocalizacao(novasCoordenadas.lat, novasCoordenadas.lng);
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px' }}>
        <Header 
          titulo="🗺️ Seletor de Área - Mapa Real!"
          subtitulo="Leaflet + OpenStreetMap + React.js + APIs Externas"
        />
        
        {loading && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '12px',
            margin: '20px 0',
            textAlign: 'center'
          }}>
            ⏳ Carregando dados...
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fecaca',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '12px',
            margin: '20px 0',
            textAlign: 'center'
          }}>
            ❌ Erro: {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          {/* Mapa Real */}
          <div style={{ flex: 1 }}>
              <ErrorBoundary>
                <MapaReal 
                  coordenadas={coordenadas}
                  setCoordenadas={setCoordenadas}
                  setArea={setArea}
                  selecionando={selecionando}
                  setSelecionando={setSelecionando}
                />
              </ErrorBoundary>
          </div>
          
          {/* Painel lateral */}
          <div style={{ width: '320px' }}>
            {/* Buscador de endereço */}
            <BuscadorEndereco 
              onCoordenadasEncontradas={handleCoordenadasEncontradas}
            />
            
            {/* Informações da seleção atual */}
            <PainelInfo 
              coordenadas={coordenadas}
              area={area}
              selecionando={selecionando}
              onSalvar={handleSalvarArea}
            />
            
            {/* APIs externas */}
            <PainelApiExterna 
              coordenadas={coordenadas?.inicio || coordenadas}
            />
            
            {/* Lista de áreas salvas */}
            <ListaAreas 
              areas={areas}
              onDeletar={deletarArea}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;