// Entities - Re-exporta do apiClient para compatibilidade
import { api } from './apiClient';

// Entidades
export const Contact = api.entities.Contact;
export const Conversation = api.entities.Conversation;
export const Task = api.entities.Task;
export const Template = api.entities.Template;
export const AIConfig = api.entities.AIConfig;

// Auth SDK
export const User = api.auth;

// Query genérico (compatibilidade com Base44)
// No Base44, Query permitia consultar qualquer entidade
// Aqui, mapeamos para as entidades específicas
export const Query = {
  from: (entityName) => {
    const entity = api.entities[entityName];
    if (!entity) {
      console.warn(`Entity "${entityName}" not found`);
      return null;
    }
    return entity;
  },
};
