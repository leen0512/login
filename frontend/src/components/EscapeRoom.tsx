import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginForm from "./LoginForm";

const EscapeRoom = () => {
  const { user } = useContext(AuthContext);
  const [showCurtain, setShowCurtain] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setShowCurtain(true);
      setTimeout(() => {
        setCurtainOpen(true);
      }, 400);
    }
  }, [user]);

  const styles = {
    container: {
      minHeight: '100vh',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    
    curtainContainer: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      pointerEvents: curtainOpen ? 'none' as const : 'auto' as const
    },
    
    curtainHalf: {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      width: '50%',
      display: 'flex'
    },
    
    curtainLeft: {
      left: 0,
      transform: curtainOpen ? 'translateX(-100%)' : 'translateX(0)',
      transition: 'transform 2.5s cubic-bezier(0.65, 0, 0.35, 1)',
      transformOrigin: 'right center'
    },
    
    curtainRight: {
      right: 0,
      transform: curtainOpen ? 'translateX(100%)' : 'translateX(0)',
      transition: 'transform 2.5s cubic-bezier(0.65, 0, 0.35, 1)',
      transformOrigin: 'left center'
    },
    
    curtainFabric: {
      width: '100%',
      height: '100%',
      position: 'relative' as const,
      background: `
        linear-gradient(
          90deg,
          #7a5847 0%,
          #8b6754 5%,
          #a67c6d 10%,
          #8b6754 15%,
          #7a5847 20%,
          #8b6754 25%,
          #a67c6d 30%,
          #8b6754 35%,
          #7a5847 40%,
          #8b6754 45%,
          #a67c6d 50%,
          #8b6754 55%,
          #7a5847 60%,
          #8b6754 65%,
          #a67c6d 70%,
          #8b6754 75%,
          #7a5847 80%,
          #8b6754 85%,
          #a67c6d 90%,
          #8b6754 95%,
          #7a5847 100%
        )
      `,
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)'
    },
    
    curtainTexture: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          rgba(0,0,0,0.1) 15px,
          transparent 30px,
          rgba(255,255,255,0.05) 45px,
          transparent 60px
        ),
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          rgba(0,0,0,0.03) 2px,
          transparent 4px
        )
      `,
      opacity: 0.6
    },
    
    curtainShadow: {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      width: '30px'
    },
    
    shadowLeft: {
      right: 0,
      background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.4))'
    },
    
    shadowRight: {
      left: 0,
      background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.4))'
    },
    
    valance: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '120px',
      background: 'linear-gradient(180deg, #6b5447 0%, #8b6754 60%, #9d7a66 100%)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
      zIndex: 1001,
      overflow: 'hidden'
    },
    
    valancePattern: {
      width: '100%',
      height: '100%',
      backgroundImage: `
        repeating-linear-gradient(
          90deg,
          rgba(0,0,0,0.1) 0px,
          transparent 50px,
          rgba(255,255,255,0.05) 100px,
          transparent 150px
        )
      `,
      opacity: 0.7
    },
    
    valanceScallop: {
      position: 'absolute' as const,
      bottom: '-25px',
      left: 0,
      right: 0,
      height: '50px',
      backgroundImage: 'radial-gradient(circle at 50% 0%, #9d7a66 35%, transparent 35%)',
      backgroundSize: '100px 50px',
      backgroundRepeat: 'repeat-x',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
    },
    
    rope: {
      position: 'absolute' as const,
      width: '12px',
      background: 'linear-gradient(90deg, #c79a6a 0%, #d4a574 50%, #c79a6a 100%)',
      boxShadow: '2px 0 6px rgba(0,0,0,0.4), inset -1px 0 2px rgba(0,0,0,0.2)',
      borderRadius: '6px',
      top: '100px',
      height: curtainOpen ? '120px' : '280px',
      transition: 'height 2s ease-out',
      zIndex: 1002
    },
    
    ropeLeft: {
      left: '8%'
    },
    
    ropeRight: {
      right: '8%'
    },
    
    tassel: {
      position: 'absolute' as const,
      bottom: '-60px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '45px',
      height: '80px',
      background: 'linear-gradient(180deg, #d4a574 0%, #c79a6a 40%, #b8956a 100%)',
      clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 50% 95%, 0% 100%)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
    },
    
    contentWrapper: {
      opacity: curtainOpen ? 1 : 0,
      transform: curtainOpen ? 'scale(1)' : 'scale(0.95)',
      transition: 'all 1.2s ease-out 2s',
      minHeight: '100vh',
      background: 'linear-gradient(165deg, #f5ebe0 0%, #e8ddd3 50%, #ddc5b5 100%)',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    
    welcomeCard: {
      background: 'rgba(255, 252, 249, 0.92)',
      backdropFilter: 'blur(20px)',
      border: '2px solid rgba(167, 124, 109, 0.2)',
      borderRadius: '12px',
      boxShadow: '0 32px 64px rgba(134, 101, 84, 0.18)',
      padding: '80px 60px',
      maxWidth: '700px',
      textAlign: 'center' as const,
      position: 'relative' as const
    },
    
    welcomeTitle: {
      fontSize: '56px',
      fontWeight: '600',
      color: '#6b5447',
      margin: '0 0 20px 0',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      letterSpacing: '0.02em'
    },
    
    welcomeSubtitle: {
      fontSize: '24px',
      color: '#8b7d72',
      margin: '0 0 40px 0',
      fontFamily: "'Lato', sans-serif"
    },
    
    userName: {
      color: '#a67c6d',
      fontWeight: '700'
    },
    
    decorativeLine: {
      width: '120px',
      height: '3px',
      background: 'linear-gradient(90deg, transparent, #a67c6d, transparent)',
      margin: '40px auto'
    },
    
    subtitle: {
      fontSize: '18px',
      color: '#9c8c7f',
      margin: '0',
      fontFamily: "'Lato', sans-serif",
      fontStyle: 'italic' as const
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;600;700&display=swap');
      `}</style>

      {!user && <LoginForm onLoginSuccess={() => {}} />}

      {user && showCurtain && (
        <>
          <div style={styles.curtainContainer}>
            {/* Valance */}
            <div style={styles.valance}>
              <div style={styles.valancePattern}></div>
              <div style={styles.valanceScallop}></div>
            </div>

            {/* Ropes with tassels */}
            <div style={{...styles.rope, ...styles.ropeLeft}}>
              <div style={styles.tassel}></div>
            </div>
            <div style={{...styles.rope, ...styles.ropeRight}}>
              <div style={styles.tassel}></div>
            </div>

            {/* Left Curtain */}
            <div style={{...styles.curtainHalf, ...styles.curtainLeft}}>
              <div style={styles.curtainFabric}>
                <div style={styles.curtainTexture}></div>
                <div style={{...styles.curtainShadow, ...styles.shadowLeft}}></div>
              </div>
            </div>

            {/* Right Curtain */}
            <div style={{...styles.curtainHalf, ...styles.curtainRight}}>
              <div style={styles.curtainFabric}>
                <div style={styles.curtainTexture}></div>
                <div style={{...styles.curtainShadow, ...styles.shadowRight}}></div>
              </div>
            </div>
          </div>

          {/* Welcome Content */}
          <div style={styles.contentWrapper}>
            <div style={styles.welcomeCard}>
              <h2 style={styles.welcomeTitle}>
                ברוכה הבאה!
              </h2>
              <div style={styles.decorativeLine}></div>
              <p style={styles.welcomeSubtitle}>
                Welcome, <span style={styles.userName}>{user.username}</span> 🎉
              </p>
              <p style={styles.subtitle}>
                Your journey begins now...
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EscapeRoom;