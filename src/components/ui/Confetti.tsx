
import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ConfettiProps {
  isActive: boolean;
}

interface ConfettiItem {
  id: number;
  left: number;
  animationDuration: number;
  delay: number;
  color: 'blue' | 'orange';
}

const Confetti: React.FC<ConfettiProps> = ({ isActive }) => {
  const [confettiItems, setConfettiItems] = useState<ConfettiItem[]>([]);
  
  useEffect(() => {
    if (isActive) {
      // Create confetti pieces with alternating navy blue and orange colors
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100, // random horizontal position
        animationDuration: 1 + Math.random() * 3, // random fall duration
        delay: Math.random() * 0.5, // random start delay
        color: Math.random() > 0.5 ? 'blue' : 'orange' as 'blue' | 'orange', // alternating colors
      }));
      
      setConfettiItems(newConfetti);
      
      // Clean up after animation
      const timer = setTimeout(() => {
        setConfettiItems([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiItems.map((item) => (
        <div
          key={item.id}
          className={`absolute top-0 animate-fall ${item.color === 'blue' ? 'text-navy-blue' : 'text-ninja-orange'}`}
          style={{
            left: `${item.left}%`,
            animationDuration: `${item.animationDuration}s`,
            animationDelay: `${item.delay}s`,
          }}
        >
          <Sparkles className="w-4 h-4" />
        </div>
      ))}
    </div>
  );
};

export default Confetti;
