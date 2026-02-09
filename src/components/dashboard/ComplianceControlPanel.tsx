import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Thermometer, Gauge, Zap, Wind, AlertTriangle, CheckCircle2, Play, Square } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { dataService } from "@/services/dataService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

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
    const { user } = useAuth();
    // --- State ---
    const [sensors, setSensors] = useState<SensorData[]>([
        { id: 'S1', name: 'Furnace A-1', type: 'temp', unit: '°C', value: 1150, emissionFactor: 0.45, limit: 600 },
        { id: 'S2', name: 'Main Boiler', type: 'pressure', unit: 'Bar', value: 85, emissionFactor: 4.2, limit: 400 },
        { id: 'S3', name: 'Assembly Line', type: 'energy', unit: 'kWh', value: 420, emissionFactor: 0.85, limit: 380 },
        { id: 'S4', name: 'Exhaust Stack', type: 'flow', unit: 'm³/h', value: 2100, emissionFactor: 0.15, limit: 350 },
    ]);

    const [totalEmissions, setTotalEmissions] = useState(0);
    const [status, setStatus] = useState<'Safe' | 'Critical'>('Safe');
    const [isSimulating, setIsSimulating] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    // Use ref for simulation interval to avoid dependency loops
    const simulationRef = useRef<NodeJS.Timeout | null>(null);

    // --- Simulation Effect ---
    useEffect(() => {
        if (isSimulating) {
            toast.info("IoT Simulation Started", { description: "Streaming sensor data to cloud..." });

            simulationRef.current = setInterval(async () => {
                const now = new Date().toLocaleTimeString();
                let paramsToSave: any[] = [];

                setSensors(prev => {
                    const nextSensors = prev.map(s => {
                        // Fluctuate value by +/- 5%
                        const change = s.value * (Math.random() * 0.1 - 0.05);
                        let newValue = s.value + change;

                        // Keep realistic bounds
                        if (s.type === 'temp') newValue = Math.max(800, Math.min(1300, newValue));
                        if (s.type === 'pressure') newValue = Math.max(60, Math.min(100, newValue));

                        // Prepare data for saving
                        paramsToSave.push({
                            sensor_id: s.id,
                            value: newValue,
                            user_id: user?.id
                        });

                        return { ...s, value: newValue };
                    });

                    // Trigger save (non-blocking)
                    paramsToSave.forEach(p => dataService.saveSensorReading(p).catch(console.error));

                    return nextSensors;
                });

                // Update chart history
                setSensors(currentSensors => {
                    const currentTotal = currentSensors.reduce((acc, s) => acc + (s.value * s.emissionFactor), 0);
                    setHistory(h => {
                        const newHistory = [...h, { time: now, emissions: currentTotal }];
                        return newHistory.slice(-20); // Keep last 20 points
                    });
                    return currentSensors;
                });

            }, 2000);
        } else {
            if (simulationRef.current) {
                clearInterval(simulationRef.current);
                simulationRef.current = null;
                toast.dismiss();
            }
        }

        return () => {
            if (simulationRef.current) clearInterval(simulationRef.current);
        };
    }, [isSimulating, user]);

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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        IoT Compliance Grid
                    </h2>
                    <p className="text-muted-foreground">Real-time sensor telemetry converting to carbon liabilities.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant={isSimulating ? "destructive" : "default"}
                        onClick={() => setIsSimulating(!isSimulating)}
                        className="w-40 shadow-lg"
                    >
                        {isSimulating ? (
                            <>
                                <Square className="w-4 h-4 mr-2 fill-current" /> Stop Sim
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2 fill-current" /> Start Sim
                            </>
                        )}
                    </Button>

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
                                        <div className="text-2xl font-bold font-mono tracking-tight flex items-baseline gap-1">
                                            <AnimatedCounter value={sensor.value} decimals={1} />
                                            <span className="text-sm font-sans text-muted-foreground">{sensor.unit}</span>
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

            {/* Total System Load & Live Graph */}
            <div className="grid gap-6 md:grid-cols-7">
                <Card className="glass-panel border-border/50 col-span-4">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" /> Live Emission Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#888888"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['auto', 'auto']}
                                    width={35}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="glass-panel p-3 rounded-lg border border-emerald-500/20 shadow-xl">
                                                    <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <span className="text-sm font-bold font-mono text-emerald-500">
                                                            {Number(payload[0].value).toFixed(1)} <span className="text-[10px]">kg/hr</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="emissions"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorEmissions)"
                                    isAnimationActive={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-border/50 col-span-3">
                    <CardHeader>
                        <CardTitle className="text-lg">Facility Carbon Load</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Total Real-time Emissions</span>
                                    <span className="font-mono">{totalEmissions.toFixed(1)} kgCO2e/hr</span>
                                </div>
                                <Progress value={(totalEmissions / 2000) * 100} className={`h-4 ${status === 'Critical' ? 'bg-red-900/20' : ''}`} />
                                <p className="text-[10px] text-muted-foreground text-right">Facility Capacity: 2000 kgCO2e/hr</p>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg border border-white/5 space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compliance Status</h4>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Projected Daily Load:</span>
                                    <span className="font-mono">{(totalEmissions * 24 / 1000).toFixed(2)} tonnes</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>CBAM Tax Liability (Est.):</span>
                                    <span className="font-mono text-amber-500">€{((totalEmissions * 24 / 1000) * 85).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
