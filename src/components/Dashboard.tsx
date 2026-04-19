import type { User, Notebook } from '../types';
import Sidebar from './Sidebar';
import NotebookDetail from './NotebookDetail';
import Profile from './Profile';
import { useState } from 'react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  notebooks: Notebook[];
  setNotebooks: React.Dispatch<React.SetStateAction<Notebook[]>>;
  activeNotebookId: string | null;
  setActiveNotebookId: (id: string | null) => void;
  activePageId: string | null;
  setActivePageId: (id: string | null) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}


export default function Dashboard(props: DashboardProps) {
  const [viewMode, setViewMode] = useState<'notebook' | 'profile'>('notebook');

  return (
    <div className="page-transition-up" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar 
        {...props} 
        onViewProfile={() => setViewMode('profile')} 
        onSelectNotebook={() => setViewMode('notebook')} 
      />
      
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex' }}>
        {viewMode === 'profile' ? (
          <Profile user={props.user} notebooks={props.notebooks} onClose={() => setViewMode('notebook')} />
        ) : props.activeNotebookId ? (
          <NotebookDetail {...props} />
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ opacity: 0.5, marginBottom: '20px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h2 style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Selecione um caderno na lateral para começar</h2>
          </div>
        )}
      </main>
    </div>
  );
}
