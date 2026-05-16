import React, { useState } from 'react';
import type { RackData } from '../types';
import { Flame, Snowflake, PowerOff, LayoutGrid, Map } from 'lucide-react';
import './RackViews.css';

interface RackViewsProps {
  racks: RackData[];
  selectedRackId: string | null;
  onSelectRack: (id: string) => void;
}

const RackViews: React.FC<RackViewsProps> = ({ racks, selectedRackId, onSelectRack }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'floorplan'>('grid');
  const [filterMode, setFilterMode] = useState<'ALL' | 'WARNING' | 'CRITICAL'>('ALL');

  const filteredRacks = racks.filter(rack => {
    if (filterMode === 'ALL') return true;
    if (filterMode === 'WARNING') return rack.status === 'warning';
    if (filterMode === 'CRITICAL') return rack.status === 'critical';
    return true;
  });

  const renderRackNode = (rack: RackData, asFloorplan: boolean) => {
    const isSelected = rack.id === selectedRackId;
    const classes = ['rack-node', `status-${rack.status}`];
    if (isSelected) classes.push('selected');
    
    // Position for floorplan
    const style: React.CSSProperties = asFloorplan && rack.position ? {
        position: 'absolute',
        left: `${rack.position.x * 60 + 50}px`,
        top: `${rack.position.y * 80 + 50}px`,
        width: '40px',
        height: '60px',
        margin: 0
    } : {};

    return (
      <div 
        key={rack.id} 
        className={classes.join(' ')}
        onClick={() => onSelectRack(rack.id)}
        style={style}
      >
        <div className="rack-id">{rack.id.split('-')[1]}</div>
        
        <div className="rack-indicators">
          {rack.status === 'cooling' && <Snowflake size={14} className="indicator-icon spin-slow" />}
          {rack.status === 'shutdown' && <PowerOff size={14} className="indicator-icon" />}
          {rack.status === 'critical' && <Flame size={14} className="indicator-icon pulse-fast" />}
          {rack.status === 'warning' && <Flame size={14} className="indicator-icon" />}
        </div>

        {!asFloorplan && (
            <div className="rack-metrics-mini">
              <span>{Math.round(rack.temperature)}°C</span>
            </div>
        )}
        
        {rack.visualSmokeDetected && (
           <div className="smoke-overlay"></div>
        )}
      </div>
    );
  };

  const renderThermalMapOverlay = () => {
      // In a real scenario, this would use a canvas or specialized library to interpolate temperatures.
      // Here we simulate hotspots around critical/warning racks.
      return filteredRacks.map(rack => {
          if (rack.status !== 'critical' && rack.status !== 'warning') return null;
          if (!rack.position) return null;
          
          const size = rack.status === 'critical' ? 250 : 150;
          const color = rack.status === 'critical' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.15)';
          const offsetLeft = rack.position.x * 60 + 50 + 20; // center of 40px width
          const offsetTop = rack.position.y * 80 + 50 + 30; // center of 60px height

          return (
              <div key={`hotspot-${rack.id}`} className="thermal-hotspot" style={{
                  left: `${offsetLeft - size/2}px`,
                  top: `${offsetTop - size/2}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
              }} />
          )
      })
  }

  return (
    <div className="rack-views-container">
      <div className="view-toggle-bar">
        <div className="toggle-group">
          <button 
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={18} /> Dynamic Grid
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'floorplan' ? 'active' : ''}`}
            onClick={() => setViewMode('floorplan')}
          >
            <Map size={18} /> 2D Floor Plan
          </button>
        </div>
        
        <div className="filter-group">
          <span className="filter-label">FILTER:</span>
          <button 
            className={`filter-btn ${filterMode === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterMode('ALL')}
          >
            ALL
          </button>
          <button 
            className={`filter-btn ${filterMode === 'WARNING' ? 'active warning' : ''}`}
            onClick={() => setFilterMode('WARNING')}
          >
            WARNINGS
          </button>
          <button 
            className={`filter-btn ${filterMode === 'CRITICAL' ? 'active critical' : ''}`}
            onClick={() => setFilterMode('CRITICAL')}
          >
            CRITICAL
          </button>
        </div>
      </div>

      <div className={`view-content ${viewMode}`}>
        {viewMode === 'grid' && (
          <div className="rack-grid">
            {filteredRacks.map(rack => renderRackNode(rack, false))}
          </div>
        )}

        {viewMode === 'floorplan' && (
          <div className="floorplan-container">
            <div className="floorplan-map">
                <div className="thermal-layer">
                    {renderThermalMapOverlay()}
                </div>
                {filteredRacks.map(rack => renderRackNode(rack, true))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RackViews;
