import { useState } from 'react';
import { PenTool, Notebook as NotebookIcon, ShieldAlert, Sun, Moon, Eye, EyeOff, AlertTriangle, User as UserIcon, Mail, Lock } from 'lucide-react';
import { styles } from '../styles/Login.styles';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { User } from '../types';

interface LoginProps {
  onLogin: (fallbackUser?: User) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export default function Login({ onLogin, isDark, setIsDark }: LoginProps) {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  
  // Easter Egg states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gmail, setGmail] = useState('');

  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onLogin(); 
    } catch (err: any) {
      console.error('Erro de Autenticação:', err);
      if (err?.code === 'auth/invalid-api-key' || err?.message?.includes('mock-key')) {
        setError('O Firebase não está configurado. Use o modo visitante ou configure o .env.');
      } else {
        setError('Houve um erro ao tentar acessar com o Google.');
      }
    }
  };

  const handleEasterEggLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalização rigorosa para o Easter Egg
    const userClean = username.trim();
    const passClean = password.trim();
    const gmailClean = gmail.trim();

    if (userClean === 'Leyley' && passClean === 'euteamocaramia' && gmailClean === '') {
      (window as any).isSecretMode = true;
      onLogin();
    } else {
      setError('Credenciais incorretas.');
    }
  };

  const confirmVisitorLogin = () => {
    const mockUser: User = {
      uid: 'local-test-uuid',
      name: 'Visitante (Beta)',
      email: 'visitante@local.app',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    };
    setShowVisitorModal(false);
    onLogin(mockUser);
  };

  return (
    <div style={styles.container}>
      {/* Background Elements */}
      <div className="bg-canvas">
        <div className="floating-shape" style={{ width: '400px', height: '400px', top: '10%', left: '10%' }}></div>
        <div className="floating-shape" style={{ width: '300px', height: '300px', bottom: '20%', right: '15%', animationDelay: '-5s' }}></div>
      </div>
      <div className="grain-overlay" />

      <button style={styles.themeToggle} onClick={() => setIsDark(!isDark)}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <PenTool size={28} />
          </div>
          <h1 style={styles.title}>StudyBook</h1>
          <p style={styles.subtitle}>
            Organize suas ideias em um ambiente limpo e focado.
          </p>
        </div>

        {error && (
          <div style={styles.alertBox}>
            <ShieldAlert size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEasterEggLogin} style={styles.inputGroup}>
          <div style={styles.inputWrapper}>
            <div style={styles.leftIcon}>
              <UserIcon size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Usuário" 
              className="input-base" 
              style={{ paddingLeft: '44px' }}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div style={styles.inputWrapper}>
            <div style={styles.leftIcon}>
              <Lock size={18} />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Senha" 
              className="input-base" 
              style={{ paddingLeft: '44px', paddingRight: '44px' }}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              style={styles.eyeIcon} 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div style={styles.inputWrapper}>
            <div style={styles.leftIcon}>
              <Mail size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Gmail" 
              className="input-base" 
              style={{ paddingLeft: '44px' }}
              value={gmail}
              onChange={e => setGmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Entrar
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          ou
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.buttonsContainer}>
          <button style={styles.googleBtn} onClick={handleGoogleLogin}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>
          <button style={styles.testBtn} onClick={() => setShowVisitorModal(true)}>
            <NotebookIcon size={18} />
            Entrar como Visitante
          </button>
        </div>
      </div>

      {showVisitorModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', color: '#d97706' }}>
              <AlertTriangle size={24} />
              <h3 style={styles.modalTitle}>Atenção: Modo Temporário</h3>
            </div>
            <p style={styles.modalText}>
              Ao entrar como visitante, suas notas serão perdidas ao sair da sessão. Deseja continuar?
            </p>
            <div style={styles.modalButtons}>
              <button className="btn btn-secondary" onClick={() => setShowVisitorModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={confirmVisitorLogin}>
                Entrar Mesmo Assim
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
