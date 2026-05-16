import React, { useState, useEffect } from 'react';
import type { RackData } from '../types';
import { ArrowLeft, Target, Scan, Activity, Camera, ShieldAlert } from 'lucide-react';
import './AIVisionConsole.css';

interface AIVisionConsoleProps {
  rack: RackData;
  onBack: () => void;
}

const AIVisionConsole: React.FC<AIVisionConsoleProps> = ({ rack, onBack }) => {
  const [scanProgress, setScanProgress] = useState(0);

  // Simulate scanning
  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(p => (p >= 100 ? 0 : p + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vision-console-container">
      <div className="console-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back to Command Center
        </button>
        <div className="console-title">
          <Target className="spin-slow" size={24} color="var(--accent-cyan)" />
          <h2>Deep Vision AI Analysis // TARGET: {rack.id}</h2>
        </div>
        <div className={`console-status ${rack.status}`}>
          {rack.status.toUpperCase()}
        </div>
      </div>

      <div className="console-main">
        {/* Thermal Analysis */}
        <div className="vision-module">
          <div className="module-header">
            <Activity size={16} />
            <span>THERMAL SPECTROMETRY</span>
            <span className="live-tag">LIVE</span>
          </div>
          <div className="module-content">
            <div className="image-wrapper">
              <img src="/thermal_cam.png" alt="Thermal" className={`raw-feed ${rack.status === 'critical' ? 'critical-filter' : ''}`} />
              <div className="scan-line" style={{ top: `${scanProgress}%` }}></div>
              
              {/* Simulated UI Overlays */}
              <div className="overlay-box" style={{ top: '20%', left: '30%', width: '40%', height: '50%', borderColor: rack.status === 'critical' ? 'var(--status-critical)' : 'var(--accent-cyan)' }}>
                <span className="box-label">CORE CLUSTER</span>
              </div>
            </div>
            <div className="data-readout">
              <div className="data-row">
                <span>Peak Temp:</span>
                <span className={rack.temperature > 50 ? 'text-critical' : 'text-normal'}>{rack.temperature.toFixed(1)}°C</span>
              </div>
              <div className="data-row">
                <span>Anomaly Score:</span>
                <span>{(rack.thermalAnomalyScore * 100).toFixed(1)}%</span>
              </div>
              <div className="data-row">
                <span>Gradient Var:</span>
                <span>±4.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Analysis */}
        <div className="vision-module">
          <div className="module-header">
            <Camera size={16} />
            <span>OPTICAL SURVEILLANCE</span>
            <span className="live-tag">LIVE</span>
          </div>
          <div className="module-content">
            <div className="image-wrapper">
              <img src="/security_cam.png" alt="Security" className="raw-feed" />
              <div className="grid-overlay"></div>
              {rack.visualSmokeDetected && (
                <div className="smoke-detected-alert">
                  <ShieldAlert size={32} />
                  <span>PARTICULATE MATTER DETECTED</span>
                </div>
              )}
            </div>
            <div className="data-readout">
              <div className="data-row">
                <span>Visual Clarity:</span>
                <span className={rack.visualSmokeDetected ? 'text-critical' : 'text-normal'}>{rack.visualSmokeDetected ? 'COMPROMISED' : '99.9%'}</span>
              </div>
              <div className="data-row">
                <span>Motion:</span>
                <span>Negative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="console-footer">
        <div className="synthesis-panel">
          <h3><Scan size={16}/> AI SYNTHESIS REPORT</h3>
          <p className="monospace-text">
            {rack.visualSmokeDetected 
              ? `CRITICAL FAILURE IMMINENT. Visual sensors confirm presence of dense particulate matter matching smoke signatures. Thermal gradients show concentrated heat gain of ${rack.temperature.toFixed(1)}°C. Immediate action required.` 
              : rack.status === 'warning' 
                ? `WARNING. Elevated thermal anomaly detected. Hardware integrity at risk but optical sensors remain clear. Recommend close monitoring and preemptive cooling.`
                : `NOMINAL. Hardware operating within safety margins. No visual or thermal anomalies detected.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIVisionConsole;
