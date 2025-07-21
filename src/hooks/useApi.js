// src/hooks/useApi.js
import { useState, useEffect } from 'react';
import api from '../services/api';

function useApi() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar todas as áreas
  const carregarAreas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getAreas();
      
      if (response.success) {
        setAreas(response.data);
      } else {
        setError('Erro ao carregar áreas');
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Salvar nova área
  const salvarArea = async (dadosArea) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.createArea(dadosArea);
      
      if (response.success) {
        // Adicionar na lista local
        setAreas(prev => [...prev, response.data]);
        return response.data;
      } else {
        setError('Erro ao salvar área');
        return null;
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error('Erro:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Deletar área
  const deletarArea = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.deleteArea(id);
      
      if (response.success) {
        // Remover da lista local
        setAreas(prev => prev.filter(area => area.id !== id));
        return true;
      } else {
        setError('Erro ao deletar área');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Carregar áreas quando o hook é usado
  useEffect(() => {
    carregarAreas();
  }, []);

  return {
    areas,
    loading,
    error,
    carregarAreas,
    salvarArea,
    deletarArea
  };
}

export default useApi;