import React from 'react';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import './NotificationLog.css';

export interface LogEntry {
  id: string;
  timestamp: string;
  rackId: string;
  type: 'WARNING' | 'CRITICAL' | 'SYSTEM';
  message: string;
}

interface NotificationLogProps {
  logs: LogEntry[];
}

const NotificationLog: React.FC<NotificationLogProps> = ({ logs }) => {
  return (
    <div className="notification-log-container">
      <div className="log-header">
        <h2>System Event Ledger</h2>
        <div className="log-stats">Total Events: {logs.length}</div>
      </div>
      <div className="log-table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Severity</th>
              <th>Target ID</th>
              <th>Analysis / Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice().reverse().map((log) => (
              <tr key={log.id} className={`log-row ${log.type.toLowerCase()}`}>
                <td className="log-time">{log.timestamp}</td>
                <td className="log-severity">
                  {log.type === 'CRITICAL' && <ShieldAlert size={14} />}
                  {log.type === 'WARNING' && <AlertTriangle size={14} />}
                  {log.type === 'SYSTEM' && <Info size={14} />}
                  <span>{log.type}</span>
                </td>
                <td className="log-target">{log.rackId}</td>
                <td className="log-message">{log.message}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-log">No anomalies detected. System operating nominally.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationLog;
