import React, { useEffect, useState } from 'react';
import type { RackData } from '../types';
import { ShieldAlert, X } from 'lucide-react';
import './AlertSystem.css';

interface AlertSystemProps {
  racks: RackData[];
  onSelectRack: (id: string) => void;
}

const AlertSystem: React.FC<AlertSystemProps> = ({ racks, onSelectRack }) => {
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const criticalRacks = racks.filter(r => r.status === 'critical');
    
    // Check if new critical racks appeared that haven't been dismissed
    const newAlerts = criticalRacks
      .map(r => r.id)
      .filter(id => !dismissedAlerts.has(id));

    if (JSON.stringify(newAlerts) !== JSON.stringify(activeAlerts)) {
       setActiveAlerts(newAlerts);
    }

    // Clean up dismissed alerts if the rack is no longer critical
    const criticalIds = new Set(criticalRacks.map(r => r.id));
    setDismissedAlerts(prev => {
      const next = new Set(prev);
      for (let id of next) {
        if (!criticalIds.has(id)) {
          next.delete(id);
        }
      }
      return next;
    });
  }, [racks]);

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveAlerts(prev => prev.filter(aId => aId !== id));
    setDismissedAlerts(prev => new Set(prev).add(id));
  };

  const handleInvestigate = (id: string) => {
    onSelectRack(id);
    // Auto-dismiss when investigating
    setActiveAlerts(prev => prev.filter(aId => aId !== id));
    setDismissedAlerts(prev => new Set(prev).add(id));
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div className="alert-container">
      {activeAlerts.map(id => {
        const rack = racks.find(r => r.id === id);
        if (!rack) return null;

        return (
          <div key={id} className="alert-card" onClick={() => handleInvestigate(id)}>
            <div className="alert-icon-wrapper pulse-fast">
              <ShieldAlert size={32} />
            </div>
            <div className="alert-content">
              <h4>CRITICAL FIRE RISK DETECTED</h4>
              <p>{rack.id} has reached a critical prediction threshold. Probability: {(rack.fireRiskProbability * 100).toFixed(1)}%</p>
              {rack.visualSmokeDetected && (
                <span className="smoke-warning">VISUAL CAM: SMOKE DETECTED</span>
              )}
            </div>
            <button className="alert-dismiss" onClick={(e) => handleDismiss(id, e)}>
              <X size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AlertSystem;
