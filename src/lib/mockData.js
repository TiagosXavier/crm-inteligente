import { faker } from '@faker-js/faker/locale/pt_BR';

// Configure faker for Brazilian data
faker.seed(123); // For reproducible results

const stages = ['novo', 'em_atendimento', 'aguardando', 'resolvido', 'escalado'];
const tags = ['VIP', 'Urgente', 'Follow-up', 'Novo Cliente', 'Reativação', 'Suporte', 'Vendas', 'Financeiro'];

// Helper to generate a Brazilian phone number
function generateBrazilianPhone() {
  const ddd = faker.helpers.arrayElement(['11', '21', '31', '41', '51', '61', '71', '81', '85', '91']);
  const prefix = '9';
  const number = faker.string.numeric(8);
  return `(${ddd}) ${prefix}${number.slice(0, 4)}-${number.slice(4)}`;
}

// Helper to generate a Brazilian CPF (simplified - not validated)
function generateCPF() {
  const numbers = faker.string.numeric(9);
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${faker.string.numeric(2)}`;
}

// Generate mock contacts
export function generateMockContacts(count = 50) {
  const contacts = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const company = faker.helpers.maybe(() => faker.company.name(), { probability: 0.7 });
    const stage = faker.helpers.arrayElement(stages);

    contacts.push({
      id: `contact_${i + 1}`,
      name,
      phone: generateBrazilianPhone(),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      cpf: faker.helpers.maybe(() => generateCPF(), { probability: 0.5 }),
      company,
      status: stage, // Compatibilidade com contacts page
      stage, // Compatibilidade com pipeline page
      tags: faker.helpers.arrayElements(tags, { min: 0, max: 3 }),
      notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 }),
      created_date: faker.date.between({
        from: new Date(2024, 0, 1),
        to: new Date()
      }).toISOString(),
      updated_date: faker.date.recent({ days: 10 }).toISOString(),
    });
  }

  return contacts;
}

// Generate mock conversations
export function generateMockConversations(contacts, count = 30) {
  const conversations = [];
  const statuses = ['ativo', 'arquivado', 'aguardando'];

  for (let i = 0; i < Math.min(count, contacts.length); i++) {
    const contact = contacts[i];

    conversations.push({
      id: `conversation_${i + 1}`,
      contact_id: contact.id,
      contact_name: contact.name,
      contact_phone: contact.phone,
      last_message: faker.lorem.sentence(),
      last_message_date: faker.date.recent({ days: 30 }).toISOString(),
      unread_count: faker.number.int({ min: 0, max: 5 }),
      status: faker.helpers.arrayElement(statuses),
      created_date: faker.date.recent({ days: 60 }).toISOString(),
    });
  }

  return conversations;
}

// Generate mock tasks
export function generateMockTasks(contacts, count = 40) {
  const tasks = [];
  const taskTypes = ['Ligar', 'Email', 'Reunião', 'Follow-up', 'Proposta', 'Demonstração'];
  const priorities = ['baixa', 'média', 'alta', 'urgente'];

  for (let i = 0; i < Math.min(count, contacts.length); i++) {
    const contact = contacts[i];
    const type = faker.helpers.arrayElement(taskTypes);
    const completed = faker.datatype.boolean({ probability: 0.3 });

    tasks.push({
      id: `task_${i + 1}`,
      title: `${type}: ${contact.name}`,
      description: faker.lorem.sentence(),
      contact_id: contact.id,
      contact_name: contact.name,
      due_date: faker.date.soon({ days: 30 }).toISOString(),
      priority: faker.helpers.arrayElement(priorities),
      completed,
      created_date: faker.date.recent({ days: 10 }).toISOString(),
      completed_date: completed ? faker.date.recent({ days: 5 }).toISOString() : null,
    });
  }

  return tasks;
}

// Generate mock users (team members)
export function generateMockUsers(count = 5) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;

    users.push({
      id: `user_${i + 1}`,
      name,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      role: faker.helpers.arrayElement(['Admin', 'Vendedor', 'Suporte', 'Gerente']),
      avatar: null,
      online: faker.datatype.boolean({ probability: 0.6 }),
      created_date: faker.date.past({ years: 1 }).toISOString(),
    });
  }

  return users;
}

// Generate mock templates
export function generateMockTemplates(count = 10) {
  const templates = [];
  const categories = ['Vendas', 'Suporte', 'Marketing', 'Follow-up', 'Cobrança'];

  for (let i = 0; i < count; i++) {
    templates.push({
      id: `template_${i + 1}`,
      name: faker.lorem.words(3),
      category: faker.helpers.arrayElement(categories),
      content: faker.lorem.paragraph(),
      active: faker.datatype.boolean({ probability: 0.7 }),
      usage_count: faker.number.int({ min: 0, max: 100 }),
      created_date: faker.date.past({ years: 1 }).toISOString(),
    });
  }

  return templates;
}

// Initialize mock data in localStorage
export function initializeMockData(force = false) {
  const MOCK_DATA_KEY = 'crm_mock_data_initialized';
  const MOCK_DATA_VERSION = '1.0';

  // Check if mock data is already initialized
  if (!force && localStorage.getItem(MOCK_DATA_KEY) === MOCK_DATA_VERSION) {
    console.log('📊 Mock data already initialized');
    return false;
  }

  console.log('🌱 Initializing mock data...');

  try {
    // Generate all mock data
    const contacts = generateMockContacts(50);
    const conversations = generateMockConversations(contacts, 30);
    const tasks = generateMockTasks(contacts, 40);
    const users = generateMockUsers(5);
    const templates = generateMockTemplates(10);

    // Store in localStorage with Base44-like structure
    localStorage.setItem('mock_contacts', JSON.stringify(contacts));
    localStorage.setItem('mock_conversations', JSON.stringify(conversations));
    localStorage.setItem('mock_tasks', JSON.stringify(tasks));
    localStorage.setItem('mock_users', JSON.stringify(users));
    localStorage.setItem('mock_templates', JSON.stringify(templates));

    // Mark as initialized
    localStorage.setItem(MOCK_DATA_KEY, MOCK_DATA_VERSION);

    console.log('✅ Mock data initialized successfully!');
    console.log(`   • ${contacts.length} contatos`);
    console.log(`   • ${conversations.length} conversas`);
    console.log(`   • ${tasks.length} tarefas`);
    console.log(`   • ${users.length} usuários`);
    console.log(`   • ${templates.length} templates`);

    return true;
  } catch (error) {
    console.error('❌ Error initializing mock data:', error);
    return false;
  }
}

// Clear mock data
export function clearMockData() {
  localStorage.removeItem('mock_contacts');
  localStorage.removeItem('mock_conversations');
  localStorage.removeItem('mock_tasks');
  localStorage.removeItem('mock_users');
  localStorage.removeItem('mock_templates');
  localStorage.removeItem('crm_mock_data_initialized');
  console.log('🗑️  Mock data cleared');
}

// Get mock data (for debugging)
export function getMockData(type) {
  const key = `mock_${type}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
