// API Client - Substitui completamente o Base44 SDK
// Usa o backend Node.js próprio

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper para fazer requisições
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// Create entity methods
const createEntityMethods = (entityName) => {
  const endpoint = `/${entityName.toLowerCase()}s`;

  return {
    // List entities with optional sort
    list: async (sort = '-created_date') => {
      const queryParams = sort ? `?sort=${sort}` : '';
      return await request(`${endpoint}${queryParams}`);
    },

    // Get entity by ID
    get: async (id) => {
      return await request(`${endpoint}/${id}`);
    },

    // Create new entity
    create: async (data) => {
      return await request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    // Update entity
    update: async (id, data) => {
      return await request(`${endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // Delete entity
    delete: async (id) => {
      return await request(`${endpoint}/${id}`, {
        method: 'DELETE',
      });
    },

    // Query with filters (simplified)
    query: async (filters = {}) => {
      const queryString = new URLSearchParams(filters).toString();
      return await request(`${endpoint}${queryString ? `?${queryString}` : ''}`);
    },
  };
};

// API Client (compatível com a estrutura do Base44)
export const api = {
  entities: {
    Contact: createEntityMethods('contact'),
    Conversation: createEntityMethods('conversation'),
    Task: createEntityMethods('task'),
    User: createEntityMethods('user'),
    Template: createEntityMethods('template'),
  },

  // Helper para seed de dados
  seed: async (data) => {
    return await request('/seed', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Health check
  health: async () => {
    return await request('/health');
  },
};

// Console log para mostrar que o API client está ativo
console.log('🔌 Using own API Client');
console.log(`📡 API URL: ${API_URL}`);
