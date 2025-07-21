// src/components/MapaReal.js
import React, { useEffect, useRef, useState } from 'react';

function MapaReal({ 
  coordenadas, 
  setCoordenadas, 
  setArea, 
  selecionando, 
  setSelecionando 
}) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const selectionLayerRef = useRef(null);
  const [mapCarregado, setMapCarregado] = useState(false);

  // Carregar Leaflet dinamicamente
  useEffect(() => {
    const carregarLeaflet = async () => {
      try {
        // CSS do Leaflet
        if (!document.querySelector('link[href*="leaflet"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          cssLink.crossOrigin = '';
          document.head.appendChild(cssLink);
        }

        // JavaScript do Leaflet
        if (!window.L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        console.log('✅ Leaflet carregado com sucesso!');
        inicializarMapa();
        
      } catch (error) {
        console.error('❌ Erro ao carregar Leaflet:', error);
      }
    };

    carregarLeaflet();

    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const inicializarMapa = () => {
    if (!mapRef.current || !window.L) return;

    try {
      // Criar mapa centrado em Blumenau, SC
      const map = window.L.map(mapRef.current, {
        center: [-26.9194, -49.0661], // Blumenau
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });

      // Adicionar tiles do OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Layer para seleções
      const selectionLayer = window.L.layerGroup().addTo(map);
      selectionLayerRef.current = selectionLayer;

      leafletMapRef.current = map;
      setMapCarregado(true);

      console.log('🗺️ Mapa inicializado em Blumenau!');

      // Configurar eventos de seleção
      configurarSelecao(map, selectionLayer);

    } catch (error) {
      console.error('❌ Erro ao inicializar mapa:', error);
    }
  };

  const configurarSelecao = (map, selectionLayer) => {
    let isDrawing = false;
    let startPoint = null;
    let currentRectangle = null;

    // Evento de mouse down
    map.on('mousedown', (e) => {
      if (e.originalEvent.shiftKey || selecionando) {
        e.originalEvent.preventDefault();
        
        isDrawing = true;
        startPoint = e.latlng;
        
        // Limpar seleção anterior
        selectionLayer.clearLayers();
        
        // Desabilitar arrastar mapa durante seleção
        map.dragging.disable();
        
        console.log('🎯 Iniciando seleção:', startPoint);
      }
    });

    // Evento de mouse move
    map.on('mousemove', (e) => {
      if (isDrawing && startPoint) {
        // Remover retângulo anterior
        if (currentRectangle) {
          selectionLayer.removeLayer(currentRectangle);
        }

        // Criar novo retângulo
        const bounds = window.L.latLngBounds(startPoint, e.latlng);
        currentRectangle = window.L.rectangle(bounds, {
          color: '#ff4444',
          weight: 3,
          fillColor: '#ff4444',
          fillOpacity: 0.2,
          stroke: true
        });

        selectionLayer.addLayer(currentRectangle);
      }

    });

    // Evento de mouse up
    map.on('mouseup', (e) => {

      console.log('🎯 DEBUG: mouseup evento disparado');
      console.log('🎯 DEBUG: isDrawing =', isDrawing);
      console.log('🎯 DEBUG: startPoint =', startPoint);
      console.log('🎯 DEBUG: e.latlng =', e.latlng);

      if (isDrawing && startPoint) {
        console.log('✅ DEBUG: Entrando na condição de finalizar seleção');
        
        isDrawing = false;
        map.dragging.enable();

        const endPoint = e.latlng;
        console.log('🎯 DEBUG: endPoint =', endPoint);

        try {
          // Calcular distância e área
          console.log('🔢 DEBUG: Calculando distância...');
          const distance = startPoint.distanceTo(endPoint) / 1000;
          console.log('✅ DEBUG: distance =', distance);

          console.log('🔢 DEBUG: Calculando área...');
          const area = calcularArea(startPoint, endPoint);
          console.log('📐 Área calculada:', area, 'tipo:', typeof area);
          
          // ✅ Verificar se área é um número válido antes de chamar setArea
          if (typeof area === 'number' && !isNaN(area)) {
            console.log('✅ Área válida, atualizando estado...');
            setArea(area);
          } else {
            console.error('❌ Área inválida:', area);
            setArea(0); // Fallback seguro
          }
          // Atualizar estado da aplicação
          console.log('🔄 DEBUG: Atualizando coordenadas...');
          setCoordenadas({
            inicio: { lat: startPoint.lat, lng: startPoint.lng },
            fim: { lat: endPoint.lat, lng: endPoint.lng }
          });
          
          console.log('🔄 DEBUG: Atualizando área...');
          setArea(area);
          
          console.log('🔄 DEBUG: Finalizando seleção...');
          setSelecionando(false);

          console.log('✅ DEBUG: Tudo funcionou!');

        } catch (error) {
          console.error('❌ Erro no mouseup:', error);
          // Fallback em caso de erro
          setArea(0);
          setSelecionando(false);
        }
      } else {
        console.log('⚠️ DEBUG: Não entrou na condição - isDrawing ou startPoint inválidos');
      }

    });

    // Evento para sair do modo seleção se mouse sair do mapa
    map.on('mouseout', () => {
      if (isDrawing) {
        isDrawing = false;
        map.dragging.enable();
      }
    });
  };

  // Função calcularArea com mais proteções:
  const calcularArea = (point1, point2) => {
    console.log('🔢 calcularArea - entrada:', { point1, point2 });
    
    try {
      // Validações rigorosas
      if (!point1 || !point2) {
        console.warn('⚠️ Pontos inválidos');
        return 0;
      }

      if (typeof point1.lat !== 'number' || typeof point1.lng !== 'number') {
        console.warn('⚠️ point1 inválido:', point1);
        return 0;
      }

      if (typeof point2.lat !== 'number' || typeof point2.lng !== 'number') {
        console.warn('⚠️ point2 inválido:', point2);
        return 0;
      }

      const R = 6371;
      const lat1 = point1.lat * Math.PI / 180;
      const lat2 = point2.lat * Math.PI / 180;
      const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
      const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

      const width = R * Math.abs(deltaLng) * Math.cos((lat1 + lat2) / 2);
      const height = R * Math.abs(deltaLat);
      const area = width * height;
      
      // Verificar se resultado é válido
      if (isNaN(area) || !isFinite(area)) {
        console.warn('⚠️ Área calculada é inválida:', area);
        return 0;
      }
      
      console.log('✅ Área calculada com sucesso:', area);
      return area;
      
    } catch (error) {
      console.error('❌ Erro ao calcular área:', error);
      return 0;
    }
  };

  // Função para ir para localização específica
  const irParaLocalizacao = (lat, lng, zoom = 15) => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([lat, lng], zoom);
      
      // Adicionar marcador temporário
      const marker = window.L.marker([lat, lng])
        .addTo(leafletMapRef.current)
        .bindPopup('📍 Localização encontrada!')
        .openPopup();

      // Remover marcador após 3 segundos
      setTimeout(() => {
        leafletMapRef.current.removeLayer(marker);
      }, 3000);
    }
  };

  // Expor função para outros componentes
  useEffect(() => {
    window.irParaLocalizacao = irParaLocalizacao;
  }, [mapCarregado]);

  return (
    <div style={{
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      position: 'relative',
      minHeight: '500px'
    }}>
      {/* Container do mapa */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '500px',
          cursor: selecionando ? 'crosshair' : 'grab'
        }}
      />

      {/* Controles personalizados */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setSelecionando(!selecionando)}
          style={{
            backgroundColor: selecionando ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {selecionando ? '❌ Cancelar' : '📐 Selecionar Área'}
        </button>

        {leafletMapRef.current && (
          <button
            onClick={() => leafletMapRef.current.setView([-26.9194, -49.0661], 13)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            🏠 Blumenau
          </button>
        )}
      </div>

      {/* Status do mapa */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        fontSize: '12px',
        zIndex: 1000
      }}>
        {!mapCarregado ? (
          <span style={{ color: '#f59e0b' }}>⏳ Carregando mapa...</span>
        ) : selecionando ? (
          <span style={{ color: '#ef4444' }}>🎯 Shift + Clique e arraste</span>
        ) : (
          <span style={{ color: '#10b981' }}>✅ Mapa carregado</span>
        )}
      </div>
    </div>
  );
}
export default MapaReal;