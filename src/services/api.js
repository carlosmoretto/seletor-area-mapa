// src/services/api.js
class ApiMock {
  constructor() {
    // Simular banco de dados em memória
    this.areas = [
      {
        id: 1,
        nome: "Centro de Blumenau",
        coordenadas: { lat: -26.9194, lng: -49.0661 },
        area: 2.5,
        valor: 250.00,
        dataCriacao: "2025-01-20"
      },
      {
        id: 2, 
        nome: "Parque Ramiro",
        coordenadas: { lat: -26.9150, lng: -49.0580 },
        area: 1.8,
        valor: 180.00,
        dataCriacao: "2025-01-19"
      }
    ];
    this.nextId = 3;
  }

  // Simular delay de rede (como API real)
  delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET - Buscar todas as áreas
  async getAreas() {
    await this.delay(800); // Simular latência
    
    console.log('📡 API: Buscando áreas...');
    return {
      success: true,
      data: this.areas,
      total: this.areas.length
    };
  }

  // GET - Buscar área por ID
  async getArea(id) {
    await this.delay(500);
    
    const area = this.areas.find(a => a.id === parseInt(id));
    
    if (area) {
      console.log(`📡 API: Área ${id} encontrada`);
      return { success: true, data: area };
    } else {
      console.log(`❌ API: Área ${id} não encontrada`);
      return { success: false, error: 'Área não encontrada' };
    }
  }

  // POST - Criar nova área
  async createArea(novaArea) {
    await this.delay(1200);
    
    const area = {
      id: this.nextId++,
      ...novaArea,
      dataCriacao: new Date().toISOString().split('T')[0]
    };
    
    this.areas.push(area);
    
    console.log('📡 API: Nova área criada', area);
    return { success: true, data: area };
  }

  // PUT - Atualizar área
  async updateArea(id, dadosAtualizados) {
    await this.delay(900);
    
    const index = this.areas.findIndex(a => a.id === parseInt(id));
    
    if (index !== -1) {
      this.areas[index] = { ...this.areas[index], ...dadosAtualizados };
      console.log(`📡 API: Área ${id} atualizada`);
      return { success: true, data: this.areas[index] };
    } else {
      return { success: false, error: 'Área não encontrada' };
    }
  }

  // DELETE - Apagar área
  async deleteArea(id) {
    await this.delay(600);
    
    const index = this.areas.findIndex(a => a.id === parseInt(id));
    
    if (index !== -1) {
      const areaRemovida = this.areas.splice(index, 1)[0];
      console.log(`📡 API: Área ${id} removida`);
      return { success: true, data: areaRemovida };
    } else {
      return { success: false, error: 'Área não encontrada' };
    }
  }
}

// Instância única da API mock
const api = new ApiMock();
export default api;