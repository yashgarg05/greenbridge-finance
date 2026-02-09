import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Thermometer, Gauge, Zap, Wind, AlertTriangle, CheckCircle2 } from "lucide-react";

// --- Types ---
type SensorData = {
    id: string;
    name: string;
    type: 'temp' | 'pressure' | 'energy' | 'flow';
    unit: string;
    value: number;
    emissionFactor: number; // e.g., 0.5 kgCO2e per unit
    limit: number; // Emission limit
};

export function ComplianceControlPanel() {
    // --- State ---
    const [sensors, setSensors] = useState<SensorData[]>([
        { id: 'S1', name: 'Furnace A-1', type: 'temp', unit: '°C', value: 1150, emissionFactor: 0.45, limit: 600 },
        { id: 'S2', name: 'Main Boiler', type: 'pressure', unit: 'Bar', value: 85, emissionFactor: 4.2, limit: 400 },
        { id: 'S3', name: 'Assembly Line', type: 'energy', unit: 'kWh', value: 420, emissionFactor: 0.85, limit: 380 },
        { id: 'S4', name: 'Exhaust Stack', type: 'flow', unit: 'm³/h', value: 2100, emissionFactor: 0.15, limit: 350 },
    ]);

    const [totalEmissions, setTotalEmissions] = useState(0);
    const [status, setStatus] = useState<'Safe' | 'Critical'>('Safe');

    // --- Simulation Effect ---
    useEffect(() => {
        const interval = setInterval(() => {
            setSensors(prev => prev.map(s => {
                // Fluctuate value by +/- 5%
                const change = s.value * (Math.random() * 0.1 - 0.05);
                let newValue = s.value + change;

                // Keep realistic bounds
                if (s.type === 'temp') newValue = Math.max(800, Math.min(1300, newValue));
                if (s.type === 'pressure') newValue = Math.max(60, Math.min(100, newValue));

                return { ...s, value: newValue };
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // --- Calculation Effect ---
    useEffect(() => {
        let currentTotal = 0;
        let isCritical = false;

        sensors.forEach(s => {
            const emission = s.value * s.emissionFactor;
            currentTotal += emission;
            if (emission > s.limit) isCritical = true;
        });

        setTotalEmissions(currentTotal);
        setStatus(isCritical ? 'Critical' : 'Safe');
    }, [sensors]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        IoT Compliance Grid
                    </h2>
                    <p className="text-muted-foreground">Real-time sensor telemetry converting to carbon liabilities.</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 transition-colors duration-500 ${status === 'Safe'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 animate-pulse'
                    }`}>
                    {status === 'Safe' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider">Plant Status</p>
                        <p className="font-bold leading-none">{status === 'Safe' ? 'COMPLIANT' : 'LIMIT EXCEEDED'}</p>
                    </div>
                </div>
            </div>

            {/* Sensor Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {sensors.map((sensor) => {
                    const currentEmission = sensor.value * sensor.emissionFactor;
                    const isOverLimit = currentEmission > sensor.limit;
                    const percent = Math.min((currentEmission / sensor.limit) * 100, 100);

                    // Icon Selection
                    const Icon =
                        sensor.type === 'temp' ? Thermometer :
                            sensor.type === 'pressure' ? Gauge :
                                sensor.type === 'energy' ? Zap : Wind;

                    return (
                        <Card key={sensor.id} className={`glass-panel overflow-hidden transition-all duration-500 ${isOverLimit ? 'border-red-500/50 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]' : 'border-border/50'
                            }`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{sensor.name}</CardTitle>
                                <Icon className={`h-4 w-4 ${isOverLimit ? 'text-red-500' : 'text-primary'}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Raw Data */}
                                    <div>
                                        <div className="text-2xl font-bold font-mono tracking-tight">
                                            {sensor.value.toFixed(1)} <span className="text-sm font-sans text-muted-foreground">{sensor.unit}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Sensor Reading</p>
                                    </div>

                                    {/* Conversion Box */}
                                    <div className={`p-3 rounded-md border ${isOverLimit ? 'bg-red-500/10 border-red-500/20' : 'bg-muted/50 border-border/50'
                                        }`}>
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[10px] font-medium uppercase opacity-70">Emission Rate</span>
                                            <span className={`text-xs font-bold font-mono ${isOverLimit ? 'text-red-500' : 'text-primary'}`}>
                                                {currentEmission.toFixed(0)} <span className="text-[9px]">kgCO2/hr</span>
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${isOverLimit ? 'bg-red-500' : 'bg-primary'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-[9px] text-muted-foreground">0</span>
                                            <span className="text-[9px] text-muted-foreground">Limit: {sensor.limit}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Total System Load */}
            <Card className="glass-panel border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg">Facility Carbon Load</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-1 w-full space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Total Real-time Emissions</span>
                                <span className="font-mono">{totalEmissions.toFixed(1)} kgCO2e/hr</span>
                            </div>
                            <Progress value={(totalEmissions / 2000) * 100} className="h-4" />
                            <p className="text-[10px] text-muted-foreground text-right">Facility Capacity: 2000 kgCO2e/hr</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setSensors(prev => prev.map(s => ({ ...s, value: s.value * 1.1 })))}>
                                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Test Surge
                            </Button>
                            <Button onClick={() => setSensors(prev => prev.map(s => ({ ...s, value: s.value * 0.9 })))}>
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Stabilize
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
