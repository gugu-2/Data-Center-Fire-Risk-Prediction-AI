import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import type { RackData } from './types';
import RackViews from './components/RackViews';
import RackDetailPanel from './components/RackDetailPanel';
import AlertSystem from './components/AlertSystem';
import NotificationLog, { type LogEntry } from './components/NotificationLog';
import AIVisionConsole from './components/AIVisionConsole';
import { Server, Activity, Thermometer, ShieldAlert, LayoutDashboard, List, ActivitySquare } from 'lucide-react';
import './App.css';

const socket = io('http://localhost:3001');

type ViewMode = 'COMMAND' | 'NOTIFICATIONS' | 'VISION';

function App() {
  const [racks, setRacks] = useState<RackData[]>([]);
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('COMMAND');
  const [visionRackId, setVisionRackId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const prevRacksRef = useRef<RackData[]>([]);

  useEffect(() => {
    socket.on('rackData', (data: RackData[]) => {
      setRacks(data);
    });

    return () => {
      socket.off('rackData');
    };
  }, []);

  // Log generation logic
  useEffect(() => {
    if (racks.length === 0) return;
    
    const newLogs: LogEntry[] = [];
    const prevRacks = prevRacksRef.current;
    
    racks.forEach(rack => {
      const prevRack = prevRacks.find(r => r.id === rack.id);
      if (!prevRack) return;

      // Transition to Warning
      if (prevRack.status !== 'warning' && rack.status === 'warning') {
        newLogs.push({
          id: `${Date.now()}-${rack.id}-warn`,
          timestamp: new Date().toLocaleTimeString(),
          rackId: rack.id,
          type: 'WARNING',
          message: `Elevated thermal parameters detected: ${rack.temperature.toFixed(1)}°C`
        });
      }
      
      // Transition to Critical
      if (prevRack.status !== 'critical' && rack.status === 'critical') {
        newLogs.push({
          id: `${Date.now()}-${rack.id}-crit`,
          timestamp: new Date().toLocaleTimeString(),
          rackId: rack.id,
          type: 'CRITICAL',
          message: rack.visualSmokeDetected ? 'Visual anomaly (Smoke) detected. Imminent risk.' : `Critical thermal threshold breached: ${rack.temperature.toFixed(1)}°C`
        });
      }
    });

    if (newLogs.length > 0) {
      setLogs(prev => [...newLogs, ...prev].slice(0, 100)); // prepend and keep last 100
    }
    
    prevRacksRef.current = racks;
  }, [racks]);

  const handleAction = (rackId: string, action: 'cooling' | 'shutdown') => {
    socket.emit('action', { rackId, action });
    setLogs(prev => [{
      id: `${Date.now()}-${rackId}-${action}`,
      timestamp: new Date().toLocaleTimeString(),
      rackId,
      type: 'SYSTEM',
      message: `Manual override: Initiated ${action} protocol.`
    }, ...prev]);
  };

  const handleDeepAnalyze = (rackId: string) => {
    setVisionRackId(rackId);
    setActiveView('VISION');
  };

  const selectedRack = racks.find(r => r.id === selectedRackId) || null;
  const visionRack = racks.find(r => r.id === visionRackId) || null;
  
  const criticalRacks = racks.filter(r => r.status === 'critical');
  const warningRacks = racks.filter(r => r.status === 'warning');

  return (
    <div className="app-container">
      <aside className="app-sidebar">
        <div className="header-brand">
          <Server className="brand-icon" size={24} />
          <h1>NEXUS CORE</h1>
        </div>
        
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeView === 'COMMAND' ? 'active' : ''}`}
            onClick={() => setActiveView('COMMAND')}
          >
            <LayoutDashboard size={18} /> COMMAND CENTER
          </button>
          <button 
            className={`nav-item ${activeView === 'NOTIFICATIONS' ? 'active' : ''}`}
            onClick={() => setActiveView('NOTIFICATIONS')}
          >
            <List size={18} /> EVENT LOG
            {logs.filter(l => l.type === 'CRITICAL').length > 0 && (
              <span style={{marginLeft: 'auto', background: 'var(--status-critical)', padding: '2px 6px', borderRadius: '2px', fontSize: '10px', color: '#fff'}}>
                {logs.filter(l => l.type === 'CRITICAL').length}
              </span>
            )}
          </button>
          <button 
            className={`nav-item ${activeView === 'VISION' ? 'active' : ''}`}
            onClick={() => setActiveView('VISION')}
            disabled={!visionRackId}
            style={{ opacity: !visionRackId ? 0.5 : 1, cursor: !visionRackId ? 'not-allowed' : 'pointer' }}
          >
            <ActivitySquare size={18} /> DEEP VISION
          </button>
        </nav>
      </aside>

      <div className="app-content-wrapper">
        <header className="top-stats-bar">
          <div className="header-stats">
            <div className="stat-pill">
              <Activity size={14} /> TTL: {racks.length}
            </div>
            <div className="stat-pill warning">
              <Thermometer size={14} /> WRN: {warningRacks.length}
            </div>
            <div className="stat-pill critical">
              <ShieldAlert size={14} /> CRT: {criticalRacks.length}
            </div>
          </div>
        </header>

        <main className="app-main">
          {activeView === 'COMMAND' && (
            <>
              <div className="grid-container">
                <RackViews 
                  racks={racks} 
                  selectedRackId={selectedRackId} 
                  onSelectRack={setSelectedRackId} 
                />
              </div>
              <div className={`panel-container ${selectedRackId ? 'open' : ''}`}>
                {selectedRack && (
                  <RackDetailPanel 
                    rack={selectedRack} 
                    onClose={() => setSelectedRackId(null)}
                    onAction={handleAction}
                    onDeepAnalyze={handleDeepAnalyze}
                  />
                )}
              </div>
            </>
          )}

          {activeView === 'NOTIFICATIONS' && (
            <NotificationLog logs={logs} />
          )}

          {activeView === 'VISION' && visionRack && (
            <AIVisionConsole rack={visionRack} onBack={() => setActiveView('COMMAND')} />
          )}
        </main>
      </div>

      {activeView === 'COMMAND' && <AlertSystem racks={racks} onSelectRack={setSelectedRackId} />}
    </div>
  );
}

export default App;
