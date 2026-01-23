// Script para popular o backend com dados mockados
import { generateMockContacts, generateMockConversations, generateMockTasks, generateMockUsers, generateMockTemplates } from '../src/lib/mockData.js';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

async function seedBackend() {
  console.log('🌱 Iniciando seed do backend...\n');

  try {
    // Check if backend is running
    const healthResponse = await fetch(`${API_URL}/health`);
    if (!healthResponse.ok) {
      throw new Error('Backend não está rodando. Execute: npm run dev:backend');
    }

    console.log('✅ Backend conectado\n');

    // Generate mock data
    console.log('📊 Gerando dados mockados...');
    const contacts = generateMockContacts(50);
    const conversations = generateMockConversations(contacts, 30);
    const tasks = generateMockTasks(contacts, 40);
    const users = generateMockUsers(5);
    const templates = generateMockTemplates(10);

    console.log(`   • ${contacts.length} contatos`);
    console.log(`   • ${conversations.length} conversas`);
    console.log(`   • ${tasks.length} tarefas`);
    console.log(`   • ${users.length} usuários`);
    console.log(`   • ${templates.length} templates\n`);

    // Send to backend
    console.log('📤 Enviando dados para o backend...');
    const response = await fetch(`${API_URL}/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contacts,
        conversations,
        tasks,
        users,
        templates,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer seed');
    }

    const result = await response.json();
    console.log('✅ Seed concluído com sucesso!\n');
    console.log('📊 Resumo:');
    console.log(`   • ${result.counts.contacts} contatos criados`);
    console.log(`   • ${result.counts.conversations} conversas criadas`);
    console.log(`   • ${result.counts.tasks} tarefas criadas`);
    console.log(`   • ${result.counts.users} usuários criados`);
    console.log(`   • ${result.counts.templates} templates criados`);
    console.log('\n🎉 Backend populado com dados mockados!');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.log('\n💡 Certifique-se de que o backend está rodando:');
    console.log('   npm run dev:backend');
    process.exit(1);
  }
}

seedBackend();
