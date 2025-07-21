// src/hooks/useExternalApi.js
import { useState } from 'react';
import externalApi from '../services/externalApi';

function useExternalApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para dados específicos
  const [endereco, setEndereco] = useState(null);
  const [clima, setClima] = useState(null);
  const [localizacaoUsuario, setLocalizacaoUsuario] = useState(null);
  const [infoPais, setInfoPais] = useState(null);

  // Buscar endereço por coordenadas
  const buscarEnderecoPorCoordenadas = async (lat, lng) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await externalApi.buscarEndereco(lat, lng);
      
      if (resultado.success) {
        setEndereco(resultado.data);
        
        // Buscar clima automaticamente
        await buscarClima(lat, lng);
        
        // Buscar informações do país
        if (resultado.data.detalhes.pais) {
          await buscarInformacoesPais(resultado.data.detalhes.pais);
        }
        
        return resultado.data;
      } else {
        setError(resultado.error);
        return null;
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar coordenadas por endereço
  const buscarCoordenadasPorEndereco = async (enderecoBusca) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await externalApi.buscarCoordenadas(enderecoBusca);
      
      if (resultado.success) {
        return resultado.data;
      } else {
        setError(resultado.error);
        return null;
      }
    } catch (err) {
      setError('Erro de conexão');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar clima
  const buscarClima = async (lat, lng) => {
    try {
      const resultado = await externalApi.buscarClima(lat, lng);
      
      if (resultado.success) {
        setClima(resultado.data);
        return resultado.data;
      } else {
        console.warn('Erro ao buscar clima:', resultado.error);
        return null;
      }
    } catch (err) {
      console.warn('Erro de conexão no clima:', err);
      return null;
    }
  };

  // Obter localização do usuário
  const obterLocalizacaoUsuario = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await externalApi.obterLocalizacaoUsuario();
      
      if (resultado.success) {
        setLocalizacaoUsuario(resultado.data);
        
        // Buscar endereço da localização atual
        await buscarEnderecoPorCoordenadas(resultado.data.lat, resultado.data.lng);
        
        return resultado.data;
      } else {
        setError(resultado.error);
        return null;
      }
    } catch (err) {
      setError('Erro ao obter localização');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar informações do país
  const buscarInformacoesPais = async (nomePais) => {
    try {
      const resultado = await externalApi.buscarInfoPais(nomePais);
      
      if (resultado.success) {
        setInfoPais(resultado.data);
        return resultado.data;
      } else {
        console.warn('Erro ao buscar informações do país:', resultado.error);
        return null;
      }
    } catch (err) {
      console.warn('Erro de conexão nas informações do país:', err);
      return null;
    }
  };

  // Limpar dados
  const limparDados = () => {
    setEndereco(null);
    setClima(null);
    setLocalizacaoUsuario(null);
    setInfoPais(null);
    setError(null);
  };

  return {
    // Estados
    loading,
    error,
    endereco,
    clima,
    localizacaoUsuario,
    infoPais,
    
    // Funções
    buscarEnderecoPorCoordenadas,
    buscarCoordenadasPorEndereco,
    obterLocalizacaoUsuario,
    limparDados
  };
}

export default useExternalApi;