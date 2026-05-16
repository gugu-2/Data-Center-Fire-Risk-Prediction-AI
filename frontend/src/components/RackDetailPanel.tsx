import React, { useEffect, useState } from 'react';
import type { RackData } from '../types';
import { X, Cpu, Zap, Camera, ShieldAlert } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './RackDetailPanel.css';

interface RackDetailPanelProps {
  rack: RackData;
  onClose: () => void;
  onAction: (rackId: string, action: 'cooling' | 'shutdown') => void;
  onDeepAnalyze: (rackId: string) => void;
}

const RackDetailPanel: React.FC<RackDetailPanelProps> = ({ rack, onClose, onAction, onDeepAnalyze }) => {
  const [history, setHistory] = useState<any[]>([]);

  const getAIConclusion = () => {
    if (rack.status === 'normal') {
      return "Thermal signatures are within optimal operating parameters. Visual feed confirms no structural anomalies or smoke particulate. Rack is stable.";
    }
    if (rack.status === 'warning') {
      return `Localized thermal gain detected (${rack.temperature.toFixed(1)}°C) exceeding baseline. Thermal anomaly score at ${(rack.thermalAnomalyScore*100).toFixed(0)}%. Visual feed is currently clear. Recommendation: Monitor for sustained escalation.`;
    }
    if (rack.status === 'cooling') {
      return "Mitigation active. Thermal signature is actively reducing. Visual feed clear. Monitoring cooldown phase.";
    }
    if (rack.status === 'shutdown') {
      return "Emergency protocols executed. Power and thermal generation halted. Core cooling rapidly.";
    }
    if (rack.visualSmokeDetected) {
       return `CRITICAL: Severe thermal spike (${rack.temperature.toFixed(1)}°C). Visual feed confirms presence of smoke/particulate matter. Imminent hardware failure or combustion detected. Immediate Emergency Shutdown required.`;
    }
    return `CRITICAL: Severe thermal spike (${rack.temperature.toFixed(1)}°C). Intense heat map clustering. Hardware integrity compromised. Recommend immediate mitigation.`;
  };

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev, {
        time: new Date().toLocaleTimeString(),
        temperature: rack.temperature,
        gpuLoad: rack.gpuLoad
      }];
      if (newHistory.length > 20) newHistory.shift();
      return newHistory;
    });
  }, [rack.temperature, rack.gpuLoad]);

  // Reset history when switching racks
  useEffect(() => {
    setHistory([]);
  }, [rack.id]);

  return (
    <div className="rack-detail-panel">
      <div className="panel-header">
        <div className="panel-title">
          <h2>{rack.id}</h2>
          <span className={`status-badge ${rack.status}`}>{rack.status.toUpperCase()}</span>
        </div>
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
      </div>

      <div className="panel-content">
        
        {/* Fire Risk Meter */}
        <div className="risk-container">
          <div className="risk-header">
            <ShieldAlert size={18} className={rack.fireRiskProbability > 0.5 ? 'text-critical' : 'text-normal'} />
            <h3>AI Fire Risk Prediction</h3>
          </div>
          <div className="progress-bar-bg">
            <div 
              className={`progress-bar-fill ${rack.fireRiskProbability > 0.8 ? 'critical' : rack.fireRiskProbability > 0.4 ? 'warning' : 'normal'}`}
              style={{ width: `${Math.min(100, rack.fireRiskProbability * 100)}%` }}
            ></div>
          </div>
          <div className="risk-value">{(rack.fireRiskProbability * 100).toFixed(1)}% Probability</div>
        </div>

        {/* Current Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <ThermometerIcon />
            <div className="metric-info">
              <span className="metric-label">Temperature</span>
              <span className="metric-value">{rack.temperature.toFixed(1)}°C</span>
            </div>
          </div>
          <div className="metric-card">
            <Cpu size={20} className="text-muted" />
            <div className="metric-info">
              <span className="metric-label">GPU Load</span>
              <span className="metric-value">{rack.gpuLoad.toFixed(1)}%</span>
            </div>
          </div>
          <div className="metric-card">
            <Zap size={20} className="text-warning" />
            <div className="metric-info">
              <span className="metric-label">Power Draw</span>
              <span className="metric-value">{rack.powerDraw.toFixed(0)} W</span>
            </div>
          </div>
          <div className="metric-card">
            <Camera size={20} className={rack.visualSmokeDetected ? 'text-critical' : 'text-muted'} />
            <div className="metric-info">
              <span className="metric-label">Visual Anomaly</span>
              <span className="metric-value">{rack.visualSmokeDetected ? 'SMOKE DETECTED' : 'Clear'}</span>
            </div>
          </div>
        </div>

        {/* AI Vision Analysis */}
        <div className="vision-analysis-section">
          <div className="vision-header">
            <h3>Vision Analysis</h3>
            <button className="deep-analyze-btn" onClick={() => onDeepAnalyze(rack.id)}>DEEP ANALYZE</button>
          </div>
          
          <div className="camera-feeds">
            <div className={`feed-container ${rack.status === 'critical' ? 'critical-glow' : ''}`}>
              <div className="feed-label">THERMAL.CAM.01</div>
              <img src="/thermal_cam.png" alt="Thermal Camera Feed" className="feed-image thermal-image" style={{ filter: rack.status === 'critical' ? 'saturate(2) hue-rotate(-20deg)' : 'none' }} />
            </div>
            <div className={`feed-container ${rack.visualSmokeDetected ? 'smoke-glow' : ''}`}>
              <div className="feed-label">SEC.CAM.04</div>
              <img src="/security_cam.png" alt="Security Camera Feed" className="feed-image security-image" />
              {rack.visualSmokeDetected && <div className="smoke-warning-overlay">WARNING: SMOKE DETECTED</div>}
            </div>
          </div>

          <div className="ai-conclusion-box">
            <div className="conclusion-label">Synthesized Conclusion:</div>
            <p className="conclusion-text">{getAIConclusion()}</p>
          </div>
        </div>

        {/* Thermal Anomaly Raw Score */}
         <div className="thermal-anomaly-section">
            <div className="thermal-header">
               <span>Thermal Camera Anomaly Score</span>
               <span>{(rack.thermalAnomalyScore * 100).toFixed(1)}%</span>
            </div>
             <div className="progress-bar-bg small">
              <div 
                className="progress-bar-fill thermal"
                style={{ width: `${Math.min(100, rack.thermalAnomalyScore * 100)}%` }}
              ></div>
            </div>
         </div>

        {/* Chart */}
        <div className="chart-container">
          <h3>Telemetry History</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-subtle)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Line type="monotone" dataKey="temperature" stroke="var(--status-critical)" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="gpuLoad" stroke="var(--accent-cyan)" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <button 
          className="action-btn cooling-btn" 
          onClick={() => onAction(rack.id, 'cooling')}
          disabled={rack.status === 'cooling' || rack.status === 'shutdown'}
        >
          Initiate Precision Cooling
        </button>
        <button 
          className="action-btn shutdown-btn"
          onClick={() => onAction(rack.id, 'shutdown')}
          disabled={rack.status === 'shutdown'}
        >
          Emergency Shutdown
        </button>
      </div>
    </div>
  );
};

function ThermometerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--status-critical)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
    </svg>
  );
}

export default RackDetailPanel;
