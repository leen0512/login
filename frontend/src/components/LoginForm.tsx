/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const { login } = useContext(AuthContext) as any;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(232, 221, 211, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#4fe174';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(username, password);
      onLoginSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(165deg, #e8ddd3 0%, #f5ebe0 35%, #ddc5b5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      position: 'relative' as const,
      overflow: 'hidden'
    },
    matrixCanvas: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.50,
      pointerEvents: 'none' as const,
      zIndex: 0
    },
    backgroundLayer: {
      position: 'absolute' as const,
      inset: '0',
      overflow: 'hidden',
      pointerEvents: 'none' as const,
      zIndex: 0
    },
    ornament: {
      position: 'absolute' as const,
      opacity: 0.08,
      filter: 'blur(1px)'
    },
    botanicalShape: {
      position: 'absolute' as const,
      borderRadius: '50%',
      filter: 'blur(80px)',
      opacity: 0.3
    },
    shape1: {
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, #c79a8a 0%, transparent 70%)',
      top: '-150px',
      right: '-100px',
      animation: 'drift 25s ease-in-out infinite'
    },
    shape2: {
      width: '450px',
      height: '450px',
      background: 'radial-gradient(circle, #a67c6d 0%, transparent 70%)',
      bottom: '-120px',
      left: '-100px',
      animation: 'drift 30s ease-in-out infinite reverse'
    },
    shape3: {
      width: '350px',
      height: '350px',
      background: 'radial-gradient(circle, #d4a5a5 0%, transparent 70%)',
      top: '45%',
      right: '15%',
      animation: 'drift 35s ease-in-out infinite'
    },
    card: {
      background: 'rgba(255, 252, 249, 0.75)',
      backdropFilter: 'blur(30px)',
      border: '1px solid rgba(167, 124, 109, 0.15)',
      borderRadius: '4px',
      boxShadow: '0 32px 64px rgba(134, 101, 84, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      padding: '56px 48px',
      width: '100%',
      maxWidth: '420px',
      position: 'relative' as const,
      zIndex: 1
    },
    decorativeLine: {
      position: 'absolute' as const,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(167, 124, 109, 0.25), transparent)',
      width: '100%',
      top: '0',
      left: '0'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '48px',
      position: 'relative' as const
    },
    iconContainer: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '72px',
      height: '72px',
      background: 'linear-gradient(135deg, #a67c6d 0%, #8b6754 100%)',
      borderRadius: '2px',
      marginBottom: '28px',
      boxShadow: '0 8px 24px rgba(134, 101, 84, 0.25)',
      position: 'relative' as const
    },
    iconBorder: {
      position: 'absolute' as const,
      inset: '-8px',
      border: '1px solid rgba(167, 124, 109, 0.15)',
      borderRadius: '2px'
    },
    title: {
      fontSize: '38px',
      fontWeight: '600',
      color: '#6b5447',
      margin: '0 0 12px 0',
      letterSpacing: '0.02em'
    },
    subtitle: {
      fontSize: '15px',
      color: '#8b7d72',
      margin: '0',
      fontWeight: '400',
      letterSpacing: '0.03em',
      fontFamily: "'Lato', sans-serif"
    },
    formGroup: {
      marginBottom: '28px'
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '600',
      color: '#8b7d72',
      marginBottom: '12px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      fontFamily: "'Lato', sans-serif"
    },
    inputWrapper: {
      position: 'relative' as const
    },
    inputIcon: {
      position: 'absolute' as const,
      left: '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a67c6d',
      pointerEvents: 'none' as const,
      transition: 'all 0.3s ease',
      opacity: 0.5
    },
    input: {
      width: '100%',
      padding: '16px 18px 16px 52px',
      fontSize: '15px',
      background: 'rgba(255, 255, 255, 0.5)',
      color: '#4a3f37',
      border: '1px solid rgba(167, 124, 109, 0.2)',
      borderRadius: '2px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
      fontFamily: "'Lato', sans-serif",
      letterSpacing: '0.01em'
    },
    button: {
      width: '100%',
      padding: '18px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#ffffff',
      background: 'linear-gradient(135deg, #a67c6d 0%, #8b6754 100%)',
      border: 'none',
      borderRadius: '2px',
      cursor: 'pointer',
      transition: 'all 0.35s ease',
      marginTop: '12px',
      position: 'relative' as const,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      boxShadow: '0 4px 16px rgba(134, 101, 84, 0.25)',
      fontFamily: "'Lato', sans-serif"
    },
    buttonContent: {
      position: 'relative' as const,
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    footer: {
      marginTop: '40px',
      paddingTop: '28px',
      borderTop: '1px solid rgba(167, 124, 109, 0.15)',
      textAlign: 'center' as const
    },
    demoText: {
      fontSize: '13px',
      color: '#8b7d72',
      margin: '0',
      fontFamily: "'Lato', sans-serif",
      letterSpacing: '0.02em'
    },
    demoUsername: {
      fontFamily: "'Courier New', monospace",
      color: '#a67c6d',
      fontWeight: '600',
      letterSpacing: '0'
    },
    courseText: {
      textAlign: 'center' as const,
      fontSize: '13px',
      color: '#9c8c7f',
      marginTop: '28px',
      position: 'relative' as const,
      zIndex: 1,
      fontFamily: "'Lato', sans-serif",
      letterSpacing: '0.03em'
    },
    spinner: {
      display: 'inline-block',
      width: '18px',
      height: '18px',
      border: '2.5px solid rgba(255,255,255,0.25)',
      borderTop: '2.5px solid white',
      borderRadius: '50%',
      animation: 'spin 0.9s linear infinite',
      marginRight: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;600;700&display=swap');
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes drift {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
          }
          33% { 
            transform: translate(30px, -50px) scale(1.05);
          }
          66% { 
            transform: translate(-25px, 25px) scale(0.98);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus {
          border-color: rgba(167, 124, 109, 0.4) !important;
          box-shadow: 0 0 0 3px rgba(167, 124, 109, 0.08) !important;
          background: rgba(255, 255, 255, 0.8) !important;
        }
        input:focus ~ div svg {
          opacity: 0.8 !important;
          color: #8b6754 !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(134, 101, 84, 0.35);
          background: linear-gradient(135deg, #8b6754 0%, #a67c6d 100%);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
        input::placeholder {
          color: #bfb3a8;
        }
        @media (max-width: 640px) {
          .botanical-shape {
            filter: blur(60px) !important;
          }
        }
      `}</style>
      
      {/* Matrix-style falling characters */}
      <canvas ref={canvasRef} style={styles.matrixCanvas} />
      
      {/* Background Elements */}
      <div style={styles.backgroundLayer}>
        <div style={{...styles.botanicalShape, ...styles.shape1}}></div>
        <div style={{...styles.botanicalShape, ...styles.shape2}}></div>
        <div style={{...styles.botanicalShape, ...styles.shape3}}></div>
        
        {/* Subtle botanical ornaments */}
        <svg style={{...styles.ornament, top: '8%', right: '12%', width: '140px', height: '140px'}} viewBox="0 0 200 200">
          <path d="M100,20 Q120,60 100,100 Q80,60 100,20" fill="#a67c6d" opacity="0.15"/>
          <path d="M20,100 Q60,80 100,100 Q60,120 20,100" fill="#a67c6d" opacity="0.15"/>
          <path d="M100,180 Q80,140 100,100 Q120,140 100,180" fill="#a67c6d" opacity="0.15"/>
          <path d="M180,100 Q140,120 100,100 Q140,80 180,100" fill="#a67c6d" opacity="0.15"/>
        </svg>
        <svg style={{...styles.ornament, bottom: '12%', left: '10%', width: '120px', height: '120px'}} viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="40" fill="none" stroke="#8b6754" strokeWidth="1" opacity="0.2"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="#8b6754" strokeWidth="1" opacity="0.15"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="#8b6754" strokeWidth="1" opacity="0.1"/>
        </svg>
      </div>

      <div style={{ maxWidth: '420px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={styles.card}>
          <div style={styles.decorativeLine}></div>
          
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <div style={styles.iconBorder}></div>
              <svg style={{ width: '36px', height: '36px', color: 'white', position: 'relative', zIndex: 1 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Enter your credentials to continue</p>
          </div>

          {/* Username Input */}
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <div style={styles.inputWrapper}>
              <input
                id="username"
                type="text"
                placeholder="your-username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
              />
              <div style={styles.inputIcon}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputWrapper}>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
              />
              <div style={styles.inputIcon}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !username || !password}
            style={{
              ...styles.button,
              ...(isLoading || !username || !password ? styles.buttonDisabled : {})
            }}
          >
            <div style={styles.buttonContent}>
              {isLoading ? (
                <>
                  <span style={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </div>
          </button>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={styles.demoText}>
              Demo credentials: <span style={styles.demoUsername}>demo@example.com</span>
            </p>
          </div>
        </div>

        {/* Course Info */}
        <p style={styles.courseText}>
          Authentication Context Demo • Course Presentation
        </p>
      </div>
    </div>
  );
};

export default LoginForm;