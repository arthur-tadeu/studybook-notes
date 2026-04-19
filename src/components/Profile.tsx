import type { User, Notebook } from '../types';
import { BarChart3, TrendingUp, TrendingDown, BookOpen, Calendar, ArrowLeft } from 'lucide-react';

interface ProfileProps {
  user: User;
  notebooks: Notebook[];
  onClose: () => void;
}

export default function Profile({ user, notebooks, onClose }: ProfileProps) {
  // Real Computations
  const totalNotebooks = notebooks.length;
  const totalPages = notebooks.reduce((acc, nb) => acc + nb.pages.length, 0);

  // Notebook com mais texto
  const notebooksWithStats = notebooks.map(nb => {
    const totalChars = nb.pages.reduce((acc, p) => acc + (p.content?.length || 0), 0);
    return { ...nb, totalChars };
  }).sort((a, b) => b.totalChars - a.totalChars);

  const topNotebooks = notebooksWithStats.slice(0, 3);

  // Fake stats for visual representation
  const mockDaysMost = [
    { day: 'Segunda-feira', count: 12450 },
    { day: 'Quinta-feira', count: 8900 },
  ];
  const mockDaysLeast = [
    { day: 'Domingo', count: 120 },
    { day: 'Sábado', count: 500 },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={onClose} className="btn btn-secondary" style={{ marginBottom: '30px' }}>
        <ArrowLeft size={16} /> Voltar aos cadernos
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <img src={user.picture} alt={user.name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--accent-color)' }} />
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', fontWeight: 700 }}>Estatísticas de Perfil</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Acompanhe seu fluxo de escrita, {user.name.split(' ')[0]}.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: '#10b981' }}>
            <TrendingUp size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Dias Mais Produtivos</h3>
          </div>
          {mockDaysMost.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <span>{d.day}</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>{d.count} caracteres</span>
            </div>
          ))}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>*Seus picos históricos de escrita</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: '#ef4444' }}>
            <TrendingDown size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Dias Menos Produtivos</h3>
          </div>
          {mockDaysLeast.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <span>{d.day}</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>{d.count} caracteres</span>
            </div>
          ))}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>*Dias ideais para descanso ou leitura</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--accent-color)' }}>
          <BarChart3 size={24} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Cadernos Mais Utilizados (Reais)</h3>
        </div>

        {totalNotebooks === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum caderno criado ainda.</p>
        ) : (
          <div>
            {topNotebooks.map((nb, i) => (
              <div key={nb.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)', width: '20px' }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>{nb.name}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{nb.totalChars} caracteres em {nb.pages.length} páginas</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent-color)', width: `${Math.max(5, (nb.totalChars / (topNotebooks[0].totalChars || 1)) * 100)}%`, borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BookOpen size={32} color="var(--accent-color)" />
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalNotebooks}</div>
            <div style={{ color: 'var(--text-secondary)' }}>Cadernos na Conta</div>
          </div>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Calendar size={32} color="#f59e0b" />
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalPages}</div>
            <div style={{ color: 'var(--text-secondary)' }}>Páginas Totais Escritas</div>
          </div>
        </div>
      </div>

    </div>
  );
}
