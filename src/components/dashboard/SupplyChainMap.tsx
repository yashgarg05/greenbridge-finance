import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';
import { useCalculations } from "@/hooks/useCalculations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useMemo } from "react";
import { Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Standard World Map TopoJSON
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountryStat {
    count: number;
    emissions: number;
    liability: number;
}

export const SupplyChainMap = () => {
    const { getCalculations } = useCalculations();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Record<string, CountryStat>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const calcs = await getCalculations();

        const countryStats: Record<string, CountryStat> = {};

        console.log("Calculations raw:", calcs);
        calcs.forEach(calc => {
            // Normalize country name roughly if needed (e.g. "China" matches, "USA" -> "United States")
            let country = calc.country_of_origin || "Unknown";
            if (country === "USA") country = "United States of America";
            if (country === "UK") country = "United Kingdom";

            if (!countryStats[country]) {
                countryStats[country] = { count: 0, emissions: 0, liability: 0 };
            }
            countryStats[country].count += 1;
            countryStats[country].emissions += (calc.total_emissions || 0);
            countryStats[country].liability += (calc.estimated_liability || 0);
        });

        setStats(countryStats);
        setLoading(false);
    };

    // Color Scale: Light Red to Dark Red based on Emissions intensity
    const colorScale = useMemo(() => {
        const maxEmissions = Math.max(...Object.values(stats).map(s => s.emissions), 0);
        return scaleLinear<string>()
            .domain([0, maxEmissions || 1])
            .range(["#ffedea", "#ff5233"] as any);
    }, [stats]);

    return (
        <Card className="col-span-1 lg:col-span-3 border-blue-500/20 bg-blue-50/10 dark:bg-blue-900/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        Supply Chain Carbon Map
                    </CardTitle>
                    <CardDescription>
                        Global distribution of your carbon emissions and liabilities.
                    </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={loadData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>
            <CardContent>
                {loading && Object.keys(stats).length === 0 ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <Skeleton className="h-[350px] w-full rounded-xl" />
                    </div>
                ) : (
                    <div className="h-[400px] w-full relative border rounded-xl overflow-hidden bg-background/50">
                        {/* Map is always visible now */}

                        <ComposableMap projectionConfig={{ scale: 147 }} className="w-full h-full">
                            <ZoomableGroup>
                                <Geographies geography={GEO_URL}>
                                    {({ geographies }) =>
                                        geographies.map((geo) => {
                                            const { name } = geo.properties;
                                            const cur = stats[name];
                                            return (
                                                <div key={geo.rsmKey} data-tooltip-id="map-tooltip" data-tooltip-content={`${name}: ${cur ? `${cur.emissions.toFixed(2)}t CO₂ | €${cur.liability.toFixed(2)}` : 'No Data'}`}>
                                                    <Geography
                                                        geography={geo}
                                                        fill={cur ? colorScale(cur.emissions) : "#EEE"}
                                                        stroke="#D6D6DA"
                                                        strokeWidth={0.5}
                                                        style={{
                                                            default: { outline: "none" },
                                                            hover: { fill: cur ? "#F53" : "#DDD", outline: "none", cursor: cur ? "pointer" : "default" },
                                                            pressed: { outline: "none" },
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                </Geographies>
                            </ZoomableGroup>
                        </ComposableMap>

                        <div className="absolute bottom-4 left-4 bg-background/90 p-2 rounded-md border text-xs shadow-md">
                            <p className="font-semibold mb-1">Emission Intensity</p>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Low</span>
                                <div className="h-2 w-24 bg-gradient-to-r from-[#ffedea] to-[#ff5233] rounded-full" />
                                <span className="text-muted-foreground">High</span>
                            </div>
                        </div>

                        <Tooltip id="map-tooltip" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
