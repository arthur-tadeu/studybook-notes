import { useEffect, useState } from 'react';
import type { User, Notebook } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getUserNotebooksFromFirestore, saveNotebookToFirestore } from './lib/firestore';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isSecret, setIsSecret] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.body.classList.contains('dark-mode');
  });

  // Persistir tema
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);


  // Carregar dados iniciais
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          picture: firebaseUser.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        };
        setUser(userData);
        
        // Carregar cadernos do Firestore
        const fetchedNotebooks = await getUserNotebooksFromFirestore(firebaseUser.uid);
        if (fetchedNotebooks.length > 0) {
          setNotebooks(fetchedNotebooks);
        } else {
          // Criar caderno inicial se vazio
          const initial = {
            id: 'notebook-' + Date.now(),
            name: 'Meu Primeiro Caderno',
            createdAt: Date.now(),
            pages: [{
              id: 'page-' + Date.now(),
              title: 'Bem-vindo ao app!',
              content: 'Seus dados já estão sendo salvos automaticamente no Firebase.',
              createdAt: Date.now()
            }]
          };
          setNotebooks([initial]);
          await saveNotebookToFirestore(firebaseUser.uid, initial);
        }
      } else if ((window as any).isSecretMode) {
        // Trigger do Easter Egg
        try {
          const { secretUser, getSecretNotebooks } = await import('./lib/secrets');
          setUser(secretUser);
          setNotebooks(getSecretNotebooks());
          setIsSecret(true);
        } catch (e) {
          console.error('Erro ao carregar segredos:', e);
          setUser(null);
        }
      } else {
        setUser(null);
        setNotebooks([]);
        setIsSecret(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sincronizar mudanças com Firestore (Debounced)
  useEffect(() => {
    if (user && !isSecret && notebooks.length > 0) {
      const timer = setTimeout(() => {
        // Sincroniza todos os cadernos (ou poderíamos otimizar para apenas o alterado)
        notebooks.forEach(nb => saveNotebookToFirestore(user.uid, nb));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notebooks, user, isSecret]);

  const handleLogout = async () => {
    try {
      (window as any).isSecretMode = false;
      await signOut(auth);
      setUser(null);
      setIsSecret(false);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c0c0e' }}>
        <div style={{ color: '#ffffff', fontFamily: 'Inter, sans-serif', animation: 'pulse 2s infinite' }}>Carregando Essência...</div>
      </div>
    );
  }

  if (!user) {
    return <Login 
      isDark={isDark} 
      setIsDark={setIsDark} 
      onLogin={async (fallbackUser) => {
        if ((window as any).isSecretMode) {
          try {
            const { secretUser, getSecretNotebooks } = await import('./lib/secrets');
            setUser(secretUser);
            setNotebooks(getSecretNotebooks());
            setIsSecret(true);
            return;
          } catch (e) {
            console.error('Erro ao carregar segredos:', e);
          }
        }
        
        if (fallbackUser) {
          setUser(fallbackUser);
          setNotebooks([{
            id: 'notebook-local',
            name: 'Caderno Local',
            createdAt: Date.now(),
            pages: [{ id: 'page-1', title: 'Bem-vindo ao Modo Teste', content: 'Exemplo de nota salva em memória.', createdAt: Date.now() }]
          }]);
        }
      }} 
    />;

  }

  return (
    <Dashboard 
      user={user}
      onLogout={handleLogout}
      notebooks={notebooks}
      setNotebooks={setNotebooks}
      activeNotebookId={activeNotebookId}
      setActiveNotebookId={setActiveNotebookId}
      activePageId={activePageId}
      setActivePageId={setActivePageId}
      isDark={isDark}
      setIsDark={setIsDark}
    />

  );
}

export default App;
