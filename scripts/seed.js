import { createClient } from '@base44/sdk';
import { faker } from '@faker-js/faker/locale/pt_BR';

// Configure faker for Brazilian data
faker.seed(123); // For reproducible results

// Base44 client configuration
const base44 = createClient({
  appId: process.env.VITE_BASE44_APP_ID || 'your-app-id',
  serverUrl: process.env.VITE_BASE44_SERVER_URL || 'https://api.base44.com',
  token: process.env.VITE_BASE44_TOKEN || '',
  functionsVersion: process.env.VITE_BASE44_FUNCTIONS_VERSION || 'v1',
  requiresAuth: false
});

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
      stage: faker.helpers.arrayElement(stages),
      tags: faker.helpers.arrayElements(tags, { min: 0, max: 3 }),
      notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 }),
      created_date: faker.date.between({
        from: new Date(2024, 0, 1),
        to: new Date()
      }).toISOString(),
    };

    try {
      const created = await base44.entities.Contact.create(contact);
      contacts.push(created);
      console.log(`✅ Contato criado: ${name}`);
    } catch (error) {
      console.error(`❌ Erro ao criar contato ${name}:`, error.message);
    }
  }

  return contacts;
}

// Generate conversations (if entity exists)
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
      const created = await base44.entities.Conversation.create(conversation);
      conversations.push(created);
      console.log(`✅ Conversa criada para: ${contact.name}`);
    } catch (error) {
      console.error(`❌ Erro ao criar conversa:`, error.message);
    }
  }

  return conversations;
}

// Generate tasks (if entity exists)
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
      const created = await base44.entities.Task.create(task);
      tasks.push(created);
      console.log(`✅ Tarefa criada: ${task.title}`);
    } catch (error) {
      console.error(`❌ Erro ao criar tarefa:`, error.message);
    }
  }

  return tasks;
}

// Main seed function
async function seed() {
  console.log('🚀 Iniciando seed do banco de dados...\n');
  console.log('📊 Configuração:');
  console.log(`   App ID: ${process.env.VITE_BASE44_APP_ID || 'não configurado'}`);
  console.log(`   Server URL: ${process.env.VITE_BASE44_SERVER_URL || 'não configurado'}\n`);

  try {
    // Generate contacts
    const contacts = await generateContacts(50);
    console.log(`\n✅ ${contacts.length} contatos criados com sucesso!`);

    // Try to generate conversations (may fail if entity doesn't exist)
    try {
      const conversations = await generateConversations(contacts, 30);
      console.log(`\n✅ ${conversations.length} conversas criadas com sucesso!`);
    } catch (error) {
      console.log('\n⚠️  Entity Conversation não encontrada, pulando...');
    }

    // Try to generate tasks (may fail if entity doesn't exist)
    try {
      const tasks = await generateTasks(contacts, 40);
      console.log(`\n✅ ${tasks.length} tarefas criadas com sucesso!`);
    } catch (error) {
      console.log('\n⚠️  Entity Task não encontrada, pulando...');
    }

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📈 Resumo:');
    console.log(`   • ${contacts.length} contatos`);
    console.log(`   • Dados prontos para visualização no dashboard`);

  } catch (error) {
    console.error('\n❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
