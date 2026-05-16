export interface RackData {
  id: string;
  temperature: number; // Celsius
  gpuLoad: number; // Percentage
  powerDraw: number; // Watts
  thermalAnomalyScore: number; // 0 to 1
  visualSmokeDetected: boolean;
  fireRiskProbability: number; // 0 to 1
  status: 'normal' | 'warning' | 'critical' | 'cooling' | 'shutdown';
  position: { x: number; y: number };
}
