import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

// --- Bespoke 3D Engine: The "Ascending Parcours" ---
type Vec3 = [number, number, number];

const rotateX = (v: Vec3, angle: number): Vec3 => {
  const [x, y, z] = v;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x, y * c - z * s, y * s + z * c];
};

const rotateY = (v: Vec3, angle: number): Vec3 => {
  const [x, y, z] = v;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x * c + z * s, y, -x * s + z * c];
};

const BAR_VERTS: Vec3[] = [
  [-0.5, 0,  0.5], [ 0.5, 0,  0.5], [ 0.5, 1,  0.5], [-0.5, 1,  0.5],
  [-0.5, 0, -0.5], [ 0.5, 0, -0.5], [ 0.5, 1, -0.5], [-0.5, 1, -0.5],
];

const BAR_FACES = [
  [0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]
];

interface TransformedFace {
  vertices: Vec3[];
  depth: number;
  color: string;
  opacity?: number;
}

export const HeroOrb3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  
  const [showBranding, setShowBranding] = useState(false);
  const [showPhrase, setShowPhrase] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  
  const phaseRef = useRef<'climbing' | 'exiting' | 'branding' | 'typing_phrase'>('climbing');
  const cycleStepRef = useRef<'branding' | 'phrase'>('branding');
  const slideOffsetRef = useRef(0);
  const groupOpacityRef = useRef(1);
  const ballIndexRef = useRef(0);
  const jumpProgressRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const phrases = [
    "Propulsez votre carrière",
    "L'orientation réinventée par l'IA",
    "Trouvez votre voie sans hésitation",
    "Un avenir sur mesure pour vous",
    "Révélez votre potentiel professionnel",
    "Votre projet de vie prend forme",
    "Des conseils éclairés par la data",
    "Naviguez sereinement vers votre futur",
    "Transformez vos compétences en succès",
    "L'IA au service de vos ambitions",
    "Découvrez les métiers qui vous ressemblent",
    "Un accompagnement intelligent",
    "Gagnez du temps dans votre orientation",
    "Des choix de carrière sûrs",
    "Prenez en main votre avenir",
    "La carte sur mesure de votre réussite",
    "Votre boussole professionnelle",
    "Analysez vos compétences rapidement",
    "De l'étudiant au pro accompli",
    "Le tremplin pour vos projets"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    let animationFrameId: number;
    let width = 0;
    let height = 0;
    
    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    let time = 0;
    const friction = 0.96;
    const power = 0.003;

    const barHeights = [0.8, 1.2, 1.6, 2.2];
    const barXPositions = [-1.5, -0.5, 0.5, 1.5];
    const barColors = [
      'hsl(210, 60%, 65%)', 
      'hsl(215, 65%, 55%)', 
      'hsl(220, 70%, 45%)', 
      'hsl(225, 80%, 35%)'
    ];

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const scale = Math.min(width, height) * (width < 640 ? 0.21 : 0.22);
      const cy = height - (width < 640 ? 10 : 40); 
      const rotX = 0.15;
      const rotY = -0.2;

      if (phaseRef.current === 'climbing') {
        jumpProgressRef.current += 0.035;
        if (jumpProgressRef.current >= 1) {
          jumpProgressRef.current = 0;
          ballIndexRef.current++;
          if (ballIndexRef.current >= barHeights.length) {
            ballIndexRef.current = barHeights.length - 1;
            jumpProgressRef.current = 1;
            if (!isTransitioningRef.current) {
              isTransitioningRef.current = true;
              setTimeout(() => {
                phaseRef.current = 'exiting';
                isTransitioningRef.current = false;
              }, 800);
            }
          }
        }
      } else if (phaseRef.current === 'exiting') {
        slideOffsetRef.current -= 0.25; // Slide left
        groupOpacityRef.current -= 0.04; // Fade out
        
        if (groupOpacityRef.current <= 0) {
          groupOpacityRef.current = 0;
          if (!isTransitioningRef.current) {
            isTransitioningRef.current = true;
            if (cycleStepRef.current === 'branding') {
              phaseRef.current = 'branding';
              setShowBranding(true);
            } else {
              phaseRef.current = 'typing_phrase';
              setShowPhrase(true);
            }
          }
        }
      }

      if (groupOpacityRef.current > 0) {
        ctx.globalAlpha = groupOpacityRef.current;
        const faces: TransformedFace[] = [];

        // --- Draw Bars ---
        barHeights.forEach((h, i) => {
          const spacing = 1.25;
          const xPos = (barXPositions[i] * spacing) + slideOffsetRef.current;
          
          BAR_FACES.forEach((faceIndices, fIdx) => {
            const transformed = faceIndices.map(vi => {
              const v = BAR_VERTS[vi];
              const pos: Vec3 = [v[0] + xPos, v[1] * h, v[2]];
              let tr = rotateX(pos, rotX);
              tr = rotateY(tr, rotY);
              return tr;
            });

            const v1 = transformed[0], v2 = transformed[1], v3 = transformed[2];
            const normalZ = (v2[0]-v1[0])*(v3[1]-v2[1]) - (v2[1]-v1[1])*(v3[0]-v2[0]);

            if (normalZ > 0) {
              let avgZ = 0;
              transformed.forEach(v => avgZ += v[2]);
              
              const shade = fIdx === 4 ? 1.2 : (fIdx === 2 || fIdx === 3 ? 0.8 : 1);
              const colorParts = barColors[i].match(/\d+/g);
              if (colorParts) {
                const [hue, sat, lum] = colorParts.map(Number);
                const finalColor = `hsl(${hue}, ${sat}%, ${lum * shade}%)`;
                faces.push({ vertices: transformed, depth: avgZ / 4, color: finalColor });
              }
            }
          });
        });

        faces.sort((a, b) => a.depth - b.depth);
        faces.forEach(face => {
          ctx.beginPath();
          ctx.fillStyle = face.color;
          ctx.strokeStyle = face.color;
          ctx.lineWidth = 0.5;
          face.vertices.forEach((v, i) => {
            const x = cx + v[0] * scale;
            const y = cy - v[1] * scale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });

        // --- Draw Ball ---
        const baseRadius = 0.4;
        let ballX = 0;
        let ballY = 0;
        const ballSpacing = 1.25;
        
        const totalProgress = (ballIndexRef.current + jumpProgressRef.current) / (barHeights.length - 1);
        const ballScaleFactor = 1 + totalProgress * 0.4;
        const currentBallRadius = baseRadius * ballScaleFactor;

        if (phaseRef.current === 'climbing') {
          const startX = ballIndexRef.current === 0 ? barXPositions[0] * ballSpacing : barXPositions[ballIndexRef.current - 1] * ballSpacing;
          const endX = barXPositions[ballIndexRef.current] * ballSpacing;
          const startY = ballIndexRef.current === 0 ? 0 : barHeights[ballIndexRef.current - 1];
          const endY = barHeights[ballIndexRef.current];
          ballX = startX + (endX - startX) * jumpProgressRef.current + slideOffsetRef.current;
          const jumpArc = Math.sin(jumpProgressRef.current * Math.PI) * 0.8;
          ballY = startY + (endY - startY) * jumpProgressRef.current + jumpArc;
        } else {
          ballX = (barXPositions[3] * ballSpacing) + slideOffsetRef.current;
          ballY = barHeights[3];
        }

        const ballScreenX = cx + ballX * scale;
        const ballScreenY = cy - (ballY + currentBallRadius) * scale;
        const ballScreenRadius = currentBallRadius * scale;

        const grad = ctx.createRadialGradient(
          ballScreenX - ballScreenRadius * 0.2,
          ballScreenY - ballScreenRadius * 0.2,
          ballScreenRadius * 0.05,
          ballScreenX,
          ballScreenY,
          ballScreenRadius
        );
        grad.addColorStop(0, 'hsl(187, 95%, 75%)'); 
        grad.addColorStop(0.4, 'hsl(187, 90%, 60%)');
        grad.addColorStop(1, 'hsl(187, 85%, 45%)'); 

        ctx.beginPath();
        ctx.arc(ballScreenX, ballScreenY, ballScreenRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        const rotationAngle = time * 2.5;
        ctx.save();
        ctx.translate(ballScreenX, ballScreenY);
        ctx.rotate(rotationAngle);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2.5;
        ctx.arc(0, 0, ballScreenRadius * 0.7, 0, Math.PI * 0.4);
        ctx.stroke();
        ctx.restore();

        ctx.globalAlpha = 1;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effectiveTheme, currentPhraseIndex]);

  const handleSequenceComplete = () => {
    if (phaseRef.current === 'branding') {
      setShowBranding(false);
      setTimeout(() => {
        phaseRef.current = 'climbing';
        cycleStepRef.current = 'phrase';
        ballIndexRef.current = 0;
        jumpProgressRef.current = 0;
        slideOffsetRef.current = 0;
        groupOpacityRef.current = 1;
        isTransitioningRef.current = false;
      }, 600);
    } else if (phaseRef.current === 'typing_phrase') {
      setShowPhrase(false);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        phaseRef.current = 'climbing';
        cycleStepRef.current = 'branding';
        ballIndexRef.current = 0;
        jumpProgressRef.current = 0;
        slideOffsetRef.current = 0;
        groupOpacityRef.current = 1;
        isTransitioningRef.current = false;
      }, 600);
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center w-full h-[180px] sm:h-[350px] lg:h-[400px] select-none">
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full"
      />
      
      {/* Animated Branding Typewriter Reveal */}
      <AnimatePresence mode="wait">
        {showBranding && (
          <motion.div 
            key="branding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 flex flex-col items-center justify-center"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter font-display text-center">
              <RealisticTypewriter 
                text="ParcoursAI" 
                onComplete={handleSequenceComplete}
                pauseTime={2500}
              />
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Typewriter Phrases */}
      <AnimatePresence mode="wait">
        {showPhrase && (
          <motion.div
            key={`phrase-${currentPhraseIndex}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute z-20 flex flex-col items-center justify-center text-center px-4"
          >
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              <RealisticTypewriter 
                text={phrases[currentPhraseIndex]} 
                onComplete={handleSequenceComplete}
                pauseTime={3000}
                isSmall
              />
            </h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TypewriterProps {
  text: string;
  onComplete: () => void;
  pauseTime: number;
  isSmall?: boolean;
}

const RealisticTypewriter: React.FC<TypewriterProps> = ({ text, onComplete, pauseTime, isSmall }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isErasing, setIsErasing] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const type = () => {
      if (!isErasing) {
        if (displayedText.length < text.length) {
          const nextChar = text.charAt(displayedText.length);
          setDisplayedText(prev => prev + nextChar);
          const speed = 60 + Math.random() * 80;
          timeout = setTimeout(type, speed);
        } else {
          timeout = setTimeout(() => setIsErasing(true), pauseTime);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(prev => prev.slice(0, -1));
          timeout = setTimeout(type, 40);
        } else {
          onComplete();
        }
      }
    };

    timeout = setTimeout(type, isErasing ? 40 : 100);
    return () => clearTimeout(timeout);
  }, [displayedText, isErasing, text, pauseTime, onComplete]);

  const renderStyledText = () => {
    if (text === "ParcoursAI") {
      return (
        <>
          <span className="text-[#0a0f1e] dark:text-white">
            {displayedText.slice(0, 8)}
          </span>
          <span className="text-cyan-400">
            {displayedText.slice(8)}
          </span>
        </>
      );
    }
    return displayedText;
  };

  return (
    <span className="inline">
      {renderStyledText()}
      <span className={`inline-block w-[3px] ${isSmall ? 'h-6 md:h-8 lg:h-10' : 'h-10 md:h-14 lg:h-16'} bg-cyan-400 ml-1 rounded-full align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
    </span>
  );
};
