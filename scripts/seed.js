import { faker } from '@faker-js/faker/locale/pt_BR';

// API URL for Node.js environment
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

// Configure faker for Brazilian data
faker.seed(123); // For reproducible results

const stages = ['novo', 'em_atendimento', 'aguardando', 'resolvido', 'escalado'];
const tags = ['VIP', 'Urgente', 'Follow-up', 'Novo Cliente', 'Reativação', 'Suporte', 'Vendas', 'Financeiro'];

// Simple API client for Node.js
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

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

// Generate contacts
async function generateContacts(count = 50) {
  console.log(`🌱 Gerando ${count} contatos mockados...`);
  const contacts = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const company = faker.helpers.maybe(() => faker.company.name(), { probability: 0.7 });

    const contact = {
      name,
      phone: generateBrazilianPhone(),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      cpf: faker.helpers.maybe(() => generateCPF(), { probability: 0.5 }),
      company,
      status: faker.helpers.arrayElement(stages),
      tags: faker.helpers.arrayElements(tags, { min: 0, max: 3 }),
      notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 }),
      assigned_to: faker.helpers.maybe(() => 'dev-user-1', { probability: 0.5 }),
      created_date: faker.date.between({
        from: new Date(2024, 0, 1),
        to: new Date()
      }).toISOString(),
    };

    try {
      const created = await apiRequest('/contacts', {
        method: 'POST',
        body: JSON.stringify(contact),
      });
      contacts.push(created);
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n❌ Erro ao criar contato ${name}:`, error.message);
    }
  }
  console.log();

  return contacts;
}

// Generate users
async function generateUsers() {
  console.log(`\n👥 Gerando usuários mockados...`);
  const users = [
    {
      email: 'admin@example.com',
      full_name: 'Administrador',
      role: 'admin',
      status: 'online',
      is_active: true,
      avatar: null,
    },
    {
      email: 'supervisor@example.com',
      full_name: 'Maria Supervisora',
      role: 'supervisor',
      status: 'online',
      is_active: true,
      avatar: null,
    },
    {
      email: 'atendente1@example.com',
      full_name: 'João Atendente',
      role: 'user',
      status: 'online',
      is_active: true,
      avatar: null,
    },
    {
      email: 'atendente2@example.com',
      full_name: 'Ana Atendente',
      role: 'user',
      status: 'away',
      is_active: true,
      avatar: null,
    },
  ];

  const created = [];
  for (const user of users) {
    try {
      const result = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(user),
      });
      created.push(result);
      console.log(`✅ Usuário criado: ${user.full_name}`);
    } catch (error) {
      console.error(`❌ Erro ao criar usuário ${user.full_name}:`, error.message);
    }
  }

  return created;
}

// Generate templates
async function generateTemplates() {
  console.log(`\n📝 Gerando templates mockados...`);
  const templates = [
    {
      name: 'Boas-vindas',
      category: 'onboarding',
      content: 'Olá {{nome}}! Seja bem-vindo(a) à nossa empresa. Estamos muito felizes em tê-lo(a) conosco!',
      is_active: true,
    },
    {
      name: 'Follow-up Comercial',
      category: 'vendas',
      content: 'Olá {{nome}}, tudo bem? Gostaria de saber se teve a oportunidade de analisar nossa proposta. Fico à disposição para esclarecer qualquer dúvida!',
      is_active: true,
    },
    {
      name: 'Confirmação de Agendamento',
      category: 'agendamento',
      content: 'Olá {{nome}}! Confirmamos seu agendamento para {{data}} às {{hora}}. Até lá!',
      is_active: true,
    },
    {
      name: 'Suporte - Primeiro Contato',
      category: 'suporte',
      content: 'Olá {{nome}}! Recebemos sua solicitação e já estamos trabalhando nela. Em breve entraremos em contato com a solução.',
      is_active: true,
    },
    {
      name: 'Pesquisa de Satisfação',
      category: 'feedback',
      content: 'Olá {{nome}}! Como foi sua experiência conosco? De 1 a 10, qual nota você daria para nosso atendimento?',
      is_active: true,
    },
  ];

  const created = [];
  for (const template of templates) {
    try {
      const result = await apiRequest('/templates', {
        method: 'POST',
        body: JSON.stringify(template),
      });
      created.push(result);
      console.log(`✅ Template criado: ${template.name}`);
    } catch (error) {
      console.error(`❌ Erro ao criar template ${template.name}:`, error.message);
    }
  }

  return created;
}

// Generate conversations
async function generateConversations(contacts, count = 30) {
  console.log(`\n💬 Gerando ${count} conversas mockadas...`);
  const conversations = [];

  for (let i = 0; i < count; i++) {
    const contact = faker.helpers.arrayElement(contacts);
    if (!contact) continue;

    const conversation = {
      contact_id: contact.id,
      contact_name: contact.name,
      contact_phone: contact.phone,
      last_message: faker.lorem.sentence(),
      last_message_date: faker.date.recent({ days: 30 }).toISOString(),
      unread_count: faker.number.int({ min: 0, max: 5 }),
      status: faker.helpers.arrayElement(['ativo', 'arquivado', 'aguardando']),
    };

    try {
      const created = await apiRequest('/conversations', {
        method: 'POST',
        body: JSON.stringify(conversation),
      });
      conversations.push(created);
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n❌ Erro ao criar conversa:`, error.message);
    }
  }
  console.log();

  return conversations;
}

// Generate tasks
async function generateTasks(contacts, count = 40) {
  console.log(`\n✓ Gerando ${count} tarefas mockadas...`);
  const tasks = [];
  const taskTypes = ['Ligar', 'Email', 'Reunião', 'Follow-up', 'Proposta', 'Demonstração'];
  const priorities = ['baixa', 'média', 'alta', 'urgente'];

  for (let i = 0; i < count; i++) {
    const contact = faker.helpers.arrayElement(contacts);
    if (!contact) continue;

    const task = {
      title: `${faker.helpers.arrayElement(taskTypes)}: ${contact.name}`,
      description: faker.lorem.sentence(),
      contact_id: contact.id,
      contact_name: contact.name,
      due_date: faker.date.soon({ days: 30 }).toISOString(),
      priority: faker.helpers.arrayElement(priorities),
      completed: faker.datatype.boolean({ probability: 0.3 }),
      created_date: faker.date.recent({ days: 10 }).toISOString(),
    };

    try {
      const created = await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      });
      tasks.push(created);
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n❌ Erro ao criar tarefa:`, error.message);
    }
  }
  console.log();

  return tasks;
}

// Main seed function
async function seed() {
  console.log('🚀 Iniciando seed do banco de dados...\n');
  console.log(`📊 API URL: ${API_URL}\n`);

  try {
    // Check if server is running
    try {
      await apiRequest('/health');
      console.log('✅ Backend está rodando!\n');
    } catch {
      console.error('❌ Backend não está rodando. Execute "npm run dev:backend" primeiro.');
      process.exit(1);
    }

    // Generate users first
    const users = await generateUsers();
    console.log(`\n✅ ${users.length} usuários criados!`);

    // Generate templates
    const templates = await generateTemplates();
    console.log(`\n✅ ${templates.length} templates criados!`);

    // Generate contacts
    const contacts = await generateContacts(50);
    console.log(`✅ ${contacts.length} contatos criados!`);

    // Generate conversations
    const conversations = await generateConversations(contacts, 30);
    console.log(`✅ ${conversations.length} conversas criadas!`);

    // Generate tasks
    const tasks = await generateTasks(contacts, 40);
    console.log(`✅ ${tasks.length} tarefas criadas!`);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📈 Resumo:');
    console.log(`   • ${users.length} usuários`);
    console.log(`   • ${templates.length} templates`);
    console.log(`   • ${contacts.length} contatos`);
    console.log(`   • ${conversations.length} conversas`);
    console.log(`   • ${tasks.length} tarefas`);

  } catch (error) {
    console.error('\n❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
