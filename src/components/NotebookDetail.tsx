import { useState, useRef } from 'react';
import type { Notebook, Page } from '../types';
import { Plus, Search, Edit3, Paintbrush, Trash2, Download } from 'lucide-react';
import DrawingCanvas from './DrawingCanvas';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface NotebookDetailProps {
  notebooks: Notebook[];
  setNotebooks: React.Dispatch<React.SetStateAction<Notebook[]>>;
  activeNotebookId: string | null;
  activePageId: string | null;
  setActivePageId: (id: string | null) => void;
}

export default function NotebookDetail({ notebooks, setNotebooks, activeNotebookId, activePageId, setActivePageId }: NotebookDetailProps) {
  const notebook = notebooks.find(nb => nb.id === activeNotebookId);
  const [searchPage, setSearchPage] = useState('');
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  if (!notebook) return null;

  const handleCreatePage = () => {
    const newPage: Page = {
      id: 'page-' + Date.now(),
      title: 'Nova Página',
      content: '',
      createdAt: Date.now()
    };

    const updatedNotebooks = notebooks.map(nb => {
      if (nb.id === notebook.id) {
        return { ...nb, pages: [newPage, ...nb.pages] };
      }
      return nb;
    });

    setNotebooks(updatedNotebooks);
    setActivePageId(newPage.id);
  };

  const activePage = notebook.pages.find(p => p.id === activePageId);

  const handleUpdatePage = (title: string, content: string, fontFamily?: string, color?: string, drawingData?: string) => {
    if (!activePageId) return;

    const updatedNotebooks = notebooks.map(nb => {
      if (nb.id === notebook.id) {
        return {
          ...nb,
          pages: nb.pages.map(p => p.id === activePageId ? { ...p, title, content, fontFamily: fontFamily !== undefined ? fontFamily : p.fontFamily, color: color !== undefined ? color : p.color, drawingData: drawingData !== undefined ? drawingData : p.drawingData } : p)
        };
      }
      return nb;
    });
    setNotebooks(updatedNotebooks);
  };

  const exportToPDF = async () => {
    if (!editorRef.current) return;
    
    const element = editorRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: document.body.classList.contains('light-mode') ? '#f8fafc' : '#0f1115'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${activePage?.title || 'pagina'}.pdf`);
  };

  const filteredPages = notebook.pages.filter(p => 
    p.title.toLowerCase().includes(searchPage.toLowerCase()) || 
    p.content.toLowerCase().includes(searchPage.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* Pages List */}
      <div className="glass-panel" style={{ width: '300px', borderTop: 'none', borderBottom: 'none', borderRadius: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>{notebook.name}</h2>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Buscar nas páginas..." 
                className="input-base" 
                style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px' }}
                value={searchPage}
                onChange={(e) => setSearchPage(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleCreatePage} style={{ padding: '8px 12px' }} title="Nova página">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredPages.map(page => (
            <div 
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer',
                background: activePageId === page.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                borderLeft: activePageId === page.id ? '3px solid var(--accent-color)' : '3px solid transparent',
                transition: 'var(--transition-fast)'
              }}
            >
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: activePageId === page.id ? (document.body.classList.contains('light-mode') ? '#0f172a' : 'white') : 'var(--text-primary)' }}>
                {page.title || 'Sem título'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {page.content || 'Nenhum conteúdo...'}
              </p>
            </div>
          ))}
          {filteredPages.length === 0 && (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Nenhuma página encontrada.
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent', position: 'relative' }}>
        {activePage ? (
          <div ref={editorRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 60px', maxWidth: '800px', margin: '0 auto', width: '100%', position: 'relative' }}>
            
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
              <select 
                className="input-base"
                style={{ width: 'auto', padding: '6px 12px', opacity: 0.8, fontSize: '0.8rem' }}
                value={activePage.fontFamily || 'inherit'}
                onChange={(e) => handleUpdatePage(activePage.title, activePage.content, e.target.value, activePage.color)}
              >
                <option value="inherit">Fonte Padrão</option>
                <option value="serif">Times / Serif</option>
                <option value="monospace">Código (Mono)</option>
                <option value="'Comic Sans MS', cursive">Divertida</option>
              </select>
              
              <input 
                type="color" 
                value={activePage.color || (document.body.classList.contains('light-mode') ? '#1e293b' : '#e2e8f0')}
                onChange={(e) => handleUpdatePage(activePage.title, activePage.content, activePage.fontFamily, e.target.value)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', height: '32px', width: '32px', padding: 0 }}
                title="Cor do Texto"
              />

              <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 8px' }} />

              <button 
                onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}
                className="btn btn-secondary"
                style={{ padding: '8px', background: isDrawingEnabled ? 'var(--accent-color)' : 'transparent', color: isDrawingEnabled ? 'white' : 'inherit' }}
                title="Modo Pincel"
              >
                <Paintbrush size={18} />
              </button>

              <button 
                onClick={() => handleUpdatePage(activePage.title, activePage.content, activePage.fontFamily, activePage.color, '')}
                className="btn btn-secondary"
                style={{ padding: '8px' }}
                title="Limpar Desenho"
              >
                <Trash2 size={18} />
              </button>

              <button 
                onClick={exportToPDF}
                className="btn btn-secondary"
                style={{ padding: '8px' }}
                title="Exportar PDF"
              >
                <Download size={18} />
              </button>
            </div>
            
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <DrawingCanvas 
                initialData={activePage.drawingData}
                onSave={(data) => handleUpdatePage(activePage.title, activePage.content, activePage.fontFamily, activePage.color, data)}
                brushColor={activePage.color || (document.body.classList.contains('light-mode') ? '#1e293b' : '#3b82f6')}
                isDrawingEnabled={isDrawingEnabled}
              />

              <input 
                type="text"
                value={activePage.title}
                onChange={(e) => handleUpdatePage(e.target.value, activePage.content, activePage.fontFamily, activePage.color)}
                placeholder="Título da página"
                style={{
                  background: 'transparent', border: 'none', fontSize: '2.5rem', fontWeight: 700, 
                  color: activePage.color || 'var(--text-primary)', marginBottom: '20px', outline: 'none', width: '100%',
                  fontFamily: activePage.fontFamily || 'inherit', position: 'relative', zIndex: 2
                }}
              />
              <textarea 
                value={activePage.content}
                onChange={(e) => handleUpdatePage(activePage.title, e.target.value, activePage.fontFamily, activePage.color)}
                placeholder="Comece a escrever algo inspirador..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', fontSize: '1.1rem',
                  color: activePage.color || 'var(--text-primary)', outline: 'none', resize: 'none', lineHeight: '1.6',
                  fontFamily: activePage.fontFamily || 'inherit', position: 'relative', zIndex: 2
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ opacity: 0.3, marginBottom: '20px' }}>
              <Edit3 size={64} />
            </div>
            <h2 style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Selecione ou crie uma página</h2>
          </div>
        )}
      </div>
    </div>
  );
}
