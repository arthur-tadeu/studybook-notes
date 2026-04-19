import { useState } from 'react';
import type { User, Notebook } from '../types';
import { Search, Plus, Book, LogOut, Star, Trash2, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  notebooks: Notebook[];
  setNotebooks: React.Dispatch<React.SetStateAction<Notebook[]>>;
  activeNotebookId: string | null;
  setActiveNotebookId: (id: string | null) => void;
  setActivePageId: (id: string | null) => void;
  onViewProfile?: () => void;
  onSelectNotebook?: () => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export default function Sidebar({ 
  user, onLogout, notebooks, setNotebooks, 
  activeNotebookId, setActiveNotebookId, setActivePageId, 
  onViewProfile, onSelectNotebook, isDark, setIsDark 
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotebookId, setEditingNotebookId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotebookName.trim()) return;

    const newNb: Notebook = {
      id: 'notebook-' + Date.now(),
      name: newNotebookName,
      createdAt: Date.now(),
      pages: []
    };

    setNotebooks([...notebooks, newNb]);
    setNewNotebookName('');
    setIsCreating(false);
    setActiveNotebookId(newNb.id);
    setActivePageId(null);
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotebooks(notebooks.map(nb => nb.id === id ? { ...nb, isFavorite: !nb.isFavorite } : nb));
  };

  const handleDeleteNotebook = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este caderno e todas as suas páginas?')) {
      const newNotebooks = notebooks.filter(nb => nb.id !== id);
      setNotebooks(newNotebooks);
      if (activeNotebookId === id) {
        setActiveNotebookId(null);
        setActivePageId(null);
      }
    }
  };

  const filteredNotebooks = notebooks
    .filter(nb => nb.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.isFavorite === b.isFavorite) return 0;
      return a.isFavorite ? -1 : 1;
    });

  return (
    <aside className="glass-panel" style={{ width: '280px', height: '100%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRadius: 0 }}>
      {/* User Profile */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onViewProfile} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Ver Perfil">
          <img 
            src={user.picture} 
            alt={user.name} 
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: '1px solid var(--border-color)', transition: 'border 0.2s' }} 
            onMouseEnter={(e) => e.currentTarget.style.borderColor='var(--accent-color)'} 
            onMouseLeave={(e) => e.currentTarget.style.borderColor='var(--border-color)'} 
          />
        </button>
        <div style={{ flex: 1, overflow: 'hidden', cursor: 'pointer' }} onClick={onViewProfile} title="Ver Perfil">
          <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: 'var(--text-primary)' }}>{user.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setIsDark(!isDark)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }} title="Mudar Tema">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }} title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Buscar cadernos..." 
            className="input-base" 
            style={{ paddingLeft: '36px', height: '40px', fontSize: '0.9rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notebooks List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 700 }}>Meus Cadernos</span>
          <button onClick={() => setIsCreating(!isCreating)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <Plus size={16} />
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreateNotebook} style={{ marginBottom: '12px', padding: '0 8px' }}>
            <input 
              autoFocus
              type="text" 
              placeholder="Nome do caderno..." 
              className="input-base" 
              style={{ fontSize: '0.85rem', padding: '8px 12px' }}
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              onBlur={() => {
                if (!newNotebookName.trim()) setIsCreating(false);
              }}
            />
          </form>
        )}

        <ul style={{ listStyle: 'none' }}>
          {filteredNotebooks.map(nb => (
            <li key={nb.id} style={{ marginBottom: '4px' }}>
              {editingNotebookId === nb.id ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (editingName.trim()) {
                    setNotebooks(notebooks.map(n => n.id === nb.id ? { ...n, name: editingName } : n));
                  }
                  setEditingNotebookId(null);
                }} style={{ padding: '0 8px' }}>
                  <input 
                    autoFocus
                    type="text" 
                    className="input-base" 
                    style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => {
                      if (editingName.trim()) {
                        setNotebooks(notebooks.map(n => n.id === nb.id ? { ...n, name: editingName } : n));
                      }
                      setEditingNotebookId(null);
                    }}
                  />
                </form>
              ) : (
                <div 
                  onClick={() => { setActiveNotebookId(nb.id); setActivePageId(null); if(onSelectNotebook) onSelectNotebook(); }}
                  onDoubleClick={() => { setEditingNotebookId(nb.id); setEditingName(nb.name); }}
                  style={{ 
                    width: '100%', display: 'flex', alignItems: 'center', gap: '12px', 
                    padding: '8px 12px', borderRadius: '10px', 
                    background: activeNotebookId === nb.id ? 'var(--accent-color)' : 'transparent',
                    color: activeNotebookId === nb.id ? 'var(--bg-color)' : 'var(--text-primary)',
                    cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => { if(activeNotebookId !== nb.id) e.currentTarget.style.background = 'rgba(128,128,128,0.08)' }}
                  onMouseLeave={(e) => { if(activeNotebookId !== nb.id) e.currentTarget.style.background = 'transparent' }}
                  title="Duis cliques para renomear"
                >
                  <Book size={16} style={{ opacity: activeNotebookId === nb.id ? 1 : 0.6 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>{nb.name}</span>
                
                  <div style={{ display: 'flex', gap: '4px', opacity: activeNotebookId === nb.id ? 1 : 0.4 }}>
                    <button 
                      onClick={(e) => handleToggleFavorite(e, nb.id)}
                      style={{ background: 'none', border: 'none', color: nb.isFavorite ? '#fbbf24' : 'inherit', cursor: 'pointer', display: 'flex', padding: '2px' }}
                    >
                      <Star size={14} fill={nb.isFavorite ? '#fbbf24' : 'none'} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteNotebook(e, nb.id)}
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', padding: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
