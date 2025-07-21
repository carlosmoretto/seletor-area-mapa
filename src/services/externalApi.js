// src/services/externalApi.js

class ExternalApiService {
  constructor() {
    // Configurações das APIs
    this.endpoints = {
      nominatim: 'https://nominatim.openstreetmap.org',
      weather: 'https://api.openweathermap.org/data/2.5',
      countries: 'https://restcountries.com/v3.1',
      // Para produção, você precisará de uma API key
      weatherApiKey: 'SUA_API_KEY_AQUI' // Vamos usar mock por enquanto
    };
  }

  // 🗺️ Geocoding - Endereço para Coordenadas
  async buscarCoordenadas(endereco) {
    try {
      console.log(`🔍 Buscando coordenadas para: ${endereco}`);
      
      const response = await fetch(
        `${this.endpoints.nominatim}/search?` +
        `q=${encodeURIComponent(endereco)}&` +
        `format=json&` +
        `limit=5&` +
        `countrycodes=br&` + // Restringir ao Brasil
        `addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Endereço não encontrado');
      }

      return {
        success: true,
        data: data.map(item => ({
          id: item.place_id,
          nome: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          tipo: item.type,
          endereco: {
            cidade: item.address?.city || item.address?.town,
            estado: item.address?.state,
            pais: item.address?.country,
            cep: item.address?.postcode
          }
        }))
      };

    } catch (error) {
      console.error('❌ Erro no geocoding:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🗺️ Reverse Geocoding - Coordenadas para Endereço
  async buscarEndereco(lat, lng) {
    try {
      console.log(`🔍 Buscando endereço para: ${lat}, ${lng}`);
      
      const response = await fetch(
        `${this.endpoints.nominatim}/reverse?` +
        `lat=${lat}&` +
        `lon=${lng}&` +
        `format=json&` +
        `addressdetails=1&` +
        `zoom=18`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          endereco: data.display_name,
          detalhes: {
            rua: data.address?.road,
            numero: data.address?.house_number,
            bairro: data.address?.suburb || data.address?.neighbourhood,
            cidade: data.address?.city || data.address?.town,
            estado: data.address?.state,
            cep: data.address?.postcode,
            pais: data.address?.country
          }
        }
      };

    } catch (error) {
      console.error('❌ Erro no reverse geocoding:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🌤️ Dados do Clima (Mock - em produção usaria OpenWeatherMap)
  async buscarClima(lat, lng) {
    try {
      console.log(`🌤️ Buscando clima para: ${lat}, ${lng}`);
      
      // Mock de dados climáticos (para demonstração)
      // Em produção, você faria:
      // const response = await fetch(`${this.endpoints.weather}/weather?lat=${lat}&lon=${lng}&appid=${this.endpoints.weatherApiKey}&units=metric&lang=pt_br`);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      
      const mockClima = {
        temperatura: Math.round(15 + Math.random() * 15), // 15-30°C
        descricao: ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuvisco'][Math.floor(Math.random() * 4)],
        umidade: Math.round(40 + Math.random() * 40), // 40-80%
        vento: Math.round(Math.random() * 20), // 0-20 km/h
        sensacao: Math.round(15 + Math.random() * 15),
        pressao: Math.round(1000 + Math.random() * 50) // 1000-1050 hPa
      };

      return {
        success: true,
        data: mockClima
      };

    } catch (error) {
      console.error('❌ Erro ao buscar clima:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🏢 Informações do País
  async buscarInfoPais(nomePais) {
    try {
      console.log(`🏢 Buscando informações do país: ${nomePais}`);
      
      const response = await fetch(
        `${this.endpoints.countries}/name/${encodeURIComponent(nomePais)}?fields=name,population,area,capital,currencies,languages,flags,region`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const pais = data[0];
      
      return {
        success: true,
        data: {
          nome: pais.name.common,
          nomeOficial: pais.name.official,
          populacao: pais.population,
          area: pais.area,
          capital: pais.capital?.[0],
          regiao: pais.region,
          moedas: Object.values(pais.currencies || {}).map(c => `${c.name} (${c.symbol})`),
          idiomas: Object.values(pais.languages || {}),
          bandeira: pais.flags.svg
        }
      };

    } catch (error) {
      console.error('❌ Erro ao buscar informações do país:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 📍 Geolocalização do usuário
  async obterLocalizacaoUsuario() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          success: false,
          error: 'Geolocalização não suportada pelo navegador'
        });
        return;
      }

      console.log('📍 Solicitando localização do usuário...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ Localização obtida:', position.coords);
          resolve({
            success: true,
            data: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              precisao: position.coords.accuracy
            }
          });
        },
        (error) => {
          console.error('❌ Erro de geolocalização:', error);
          let mensagem = 'Erro ao obter localização';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              mensagem = 'Permissão de localização negada';
              break;
            case error.POSITION_UNAVAILABLE:
              mensagem = 'Localização indisponível';
              break;
            case error.TIMEOUT:
              mensagem = 'Timeout na solicitação de localização';
              break;
          }
          
          resolve({
            success: false,
            error: mensagem
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    });
  }
}

// Instância única do serviço
const externalApi = new ExternalApiService();
export default externalApi;