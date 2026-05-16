import { EventEmitter } from 'events';

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

export class SimulationEngine extends EventEmitter {
  private racks: RackData[] = [];
  private numRacks: number;
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor(numRacks: number = 100) {
    super();
    this.numRacks = numRacks;
    this.initializeRacks();
  }

  private initializeRacks() {
    for (let i = 0; i < this.numRacks; i++) {
      const row = Math.floor(i / 10);
      const col = i % 10;
      this.racks.push({
        id: `RACK-${(i + 1).toString().padStart(3, '0')}`,
        temperature: 25 + Math.random() * 10,
        gpuLoad: 20 + Math.random() * 60,
        powerDraw: 1000 + Math.random() * 2000,
        thermalAnomalyScore: Math.random() * 0.1,
        visualSmokeDetected: false,
        fireRiskProbability: 0,
        status: 'normal',
        position: { x: col, y: row },
      });
    }
  }

  public start() {
    if (this.simulationInterval) return;

    this.simulationInterval = setInterval(() => {
      this.tick();
    }, 2000); // Update every 2 seconds
  }

  public stop() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  private tick() {
    // Randomly select one rack to have an "anomaly" sometimes
    const anomalyIndex = Math.random() > 0.8 ? Math.floor(Math.random() * this.numRacks) : -1;

    this.racks = this.racks.map((rack, index) => {
      if (rack.status === 'shutdown') {
        return {
           ...rack,
           temperature: Math.max(25, rack.temperature - 5),
           gpuLoad: 0,
           powerDraw: 0,
           thermalAnomalyScore: 0,
           visualSmokeDetected: false,
           fireRiskProbability: 0,
        }
      }

      if (rack.status === 'cooling') {
        return {
           ...rack,
           temperature: Math.max(25, rack.temperature - 2),
           thermalAnomalyScore: Math.max(0, rack.thermalAnomalyScore - 0.1),
           fireRiskProbability: Math.max(0, rack.fireRiskProbability - 0.1),
           status: rack.temperature < 40 ? 'normal' : 'cooling'
        }
      }

      // Normal fluctuation
      let newTemp = rack.temperature + (Math.random() * 2 - 1);
      let newGpu = Math.max(10, Math.min(100, rack.gpuLoad + (Math.random() * 10 - 5)));
      let newPower = 1000 + (newGpu * 30) + (Math.random() * 200 - 100);
      let newThermal = Math.max(0, Math.min(1, rack.thermalAnomalyScore + (Math.random() * 0.05 - 0.025)));
      let visualSmoke = rack.visualSmokeDetected;

      if (index === anomalyIndex) {
        // Spike!
        newTemp += 5 + Math.random() * 5;
        newGpu = Math.min(100, newGpu + 20);
        newThermal = Math.min(1, newThermal + 0.3);
      }

      // Calculate Fire Risk Probability based on sensors
      // High temp + High Thermal Anomaly = High Risk
      let risk = 0;
      if (newTemp > 60) risk += 0.2;
      if (newTemp > 80) risk += 0.4;
      if (newThermal > 0.5) risk += 0.2;
      if (newThermal > 0.8) risk += 0.3;
      if (newGpu > 95) risk += 0.1;
      
      if (newTemp > 95 && newThermal > 0.9) {
          visualSmoke = Math.random() > 0.5; // Visual camera catches smoke
      }
      
      if (visualSmoke) {
          risk += 0.5;
      }

      risk = Math.min(1, risk);

      let status = rack.status;
      if (status !== 'cooling' && status !== 'shutdown') {
        if (risk > 0.8) status = 'critical';
        else if (risk > 0.4) status = 'warning';
        else status = 'normal';
      }

      return {
        ...rack,
        temperature: newTemp,
        gpuLoad: newGpu,
        powerDraw: newPower,
        thermalAnomalyScore: newThermal,
        visualSmokeDetected: visualSmoke,
        fireRiskProbability: risk,
        status: status,
      };
    });

    this.emit('tick', this.racks);
  }

  public handleAction(rackId: string, action: 'cooling' | 'shutdown') {
    const rackIndex = this.racks.findIndex(r => r.id === rackId);
    if (rackIndex !== -1) {
      this.racks[rackIndex].status = action;
      // Immediately emit updated state
      this.emit('tick', this.racks);
    }
  }

  public getRacks() {
    return this.racks;
  }
}
