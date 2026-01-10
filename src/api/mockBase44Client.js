// Mock Base44 Client para desenvolvimento local
// Este cliente simula o comportamento do Base44 SDK usando localStorage

import { initializeMockData, getMockData } from '@/lib/mockData';

// Initialize mock data on first load
if (typeof window !== 'undefined') {
  initializeMockData();
}

// Helper to generate ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to get data from localStorage
const getData = (entityName) => {
  const key = `mock_${entityName.toLowerCase()}s`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper to save data to localStorage
const saveData = (entityName, data) => {
  const key = `mock_${entityName.toLowerCase()}s`;
  localStorage.setItem(key, JSON.stringify(data));
};

// Create entity methods
const createEntityMethods = (entityName) => ({
  // List entities with optional sort
  list: async (sort = '-created_date') => {
    const data = getData(entityName);

    // Simple sort implementation
    if (sort) {
      const [direction, field] = sort.startsWith('-')
        ? ['desc', sort.slice(1)]
        : ['asc', sort];

      data.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];

        if (direction === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      });
    }

    return data;
  },

  // Get entity by ID
  get: async (id) => {
    const data = getData(entityName);
    const item = data.find(item => item.id === id);
    if (!item) {
      throw new Error(`${entityName} not found`);
    }
    return item;
  },

  // Create new entity
  create: async (newData) => {
    const data = getData(entityName);
    const now = new Date().toISOString();

    const newItem = {
      id: generateId(),
      ...newData,
      created_date: now,
      updated_date: now,
    };

    data.push(newItem);
    saveData(entityName, data);

    return newItem;
  },

  // Update entity
  update: async (id, updates) => {
    const data = getData(entityName);
    const index = data.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error(`${entityName} not found`);
    }

    data[index] = {
      ...data[index],
      ...updates,
      updated_date: new Date().toISOString(),
    };

    saveData(entityName, data);
    return data[index];
  },

  // Delete entity
  delete: async (id) => {
    const data = getData(entityName);
    const index = data.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error(`${entityName} not found`);
    }

    const deleted = data.splice(index, 1)[0];
    saveData(entityName, data);

    return deleted;
  },

  // Query with filters (simplified)
  query: async (filters = {}) => {
    let data = getData(entityName);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data = data.filter(item => item[key] === value);
      }
    });

    return data;
  },
});

// Mock Base44 Client
export const base44 = {
  entities: {
    Contact: createEntityMethods('Contact'),
    Conversation: createEntityMethods('Conversation'),
    Task: createEntityMethods('Task'),
    User: createEntityMethods('User'),
    Template: createEntityMethods('Template'),
  },
};

// Export helper to check if using mock
export const isMockMode = true;

// Console log to show mock mode is active
if (typeof window !== 'undefined') {
  console.log('🎭 Using Mock Base44 Client (local data)');
  console.log('💡 Data is stored in localStorage');
  console.log('🔧 To clear mock data: localStorage.clear()');
}
