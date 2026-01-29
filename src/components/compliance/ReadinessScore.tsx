import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReadinessScore() {
    const score = 85;

    return (
        <Card className="data-card h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">CBAM Readiness Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Simple SVG Circular Progress for demo */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-muted/20"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * score) / 100}
                            className="text-primary transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{score}%</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Ready</span>
                    </div>
                </div>
                <div className="mt-6 space-y-2 w-full">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Data Completeness</span>
                        <span className="font-medium text-green-500">100%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Verification</span>
                        <span className="font-medium text-amber-500">Pending</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Registration</span>
                        <span className="font-medium text-green-500">Complete</span>
                    </div>
                </div>

                {/* Next Steps Section */}
                <div className="mt-6 pt-4 border-t w-full space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recommended Actions</p>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-xs bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-100 dark:border-amber-800">
                            <span className="font-bold text-amber-600 shrink-0">+5%</span>
                            <span className="text-amber-800 dark:text-amber-200">Verify Aluminum Emissions Data for Q1</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800">
                            <span className="font-bold text-blue-600 shrink-0">+10%</span>
                            <span className="text-blue-800 dark:text-blue-200">Submit Declarant Authorization Form</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
