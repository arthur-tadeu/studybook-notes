import { User, Notebook } from '../types';

/**
 * ATENÇÃO: Este arquivo é um wrapper para Variáveis de Ambiente.
 * Os dados reais devem ser configurados no painel do Vercel.
 */

export const secretUser: User = {
  uid: 'secret-mode',
  name: import.meta.env.VITE_SECRET_USER_NAME || 'Secret Admin',
  email: import.meta.env.VITE_SECRET_USER_EMAIL || 'secret@admin.com',
  picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Secret',
};

export const getSecretNotebooks = (): Notebook[] => {
  try {
    const raw = import.meta.env.VITE_SECRET_NOTEBOOKS_JSON;
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Falha ao processar notebooks secretos das variáveis de ambiente:', e);
  }
  
  // Fallback padrão para garantir que o build passe e o app abra
  return [{
    id: 'notebook-secret-fallback',
    name: 'Modo Secreto (Configuração Pendente)',
    createdAt: Date.now(),
    pages: [{ 
      id: 'page-fallback', 
      title: 'Configuração Necessária', 
      content: 'Para ver as notas reais aqui, configure a variável VITE_SECRET_NOTEBOOKS_JSON no painel do Vercel com um array JSON de notebooks.', 
      createdAt: Date.now() 
    }]
  }];
};
