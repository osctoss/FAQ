import { createContext, useContext, useState, useEffect } from 'react';
import qpService from '../services/qp.service';

const QPContext = createContext(null);

export function QPProvider({ children }) {
  const [qp, setQP] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchQP = async () => {
    try {
      const score = await qpService.getMyScore();
      setQP(score);
    } catch (e) {
      // silent fail
    }
  };

  const awardQP = (amount) => {
    setQP(prev => prev + amount);
  };

  const deductQP = (amount) => {
    setQP(prev => prev - Math.abs(amount));
  };

  return (
    <QPContext.Provider value={{ qp, loading, fetchQP, awardQP, deductQP }}>
      {children}
    </QPContext.Provider>
  );
}

export function useQP() {
  const context = useContext(QPContext);
  if (!context) throw new Error('useQP must be used within QPProvider');
  return context;
}