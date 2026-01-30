
export const GreenBridgeLogo = ({ className = "", showText = true, size = "md" }: { className?: string, showText?: boolean, size?: "sm" | "md" | "lg" | "xl" }) => {

    // Size mappings for the container
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-9 w-9",
        lg: "h-12 w-12",
        xl: "h-20 w-20"
    };

    // Text size mappings
    const textClasses = {
        sm: "text-base",
        md: "text-xl",
        lg: "text-3xl",
        xl: "text-5xl"
    };

    return (
        <div className={`flex items-center gap-3 ${className} group`}>
            {/* Custom Abstract Logo: "The Infinity Leaf" */}
            {/* Symbolizes: Circular Economy, Connection (Bridge), and Nature (Leaf) */}
            <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                    <defs>
                        <linearGradient id="leafGradient" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#10B981" /> {/* emerald-500 */}
                            <stop offset="1" stopColor="#06B6D4" /> {/* cyan-500 */}
                        </linearGradient>
                        <linearGradient id="bridgeGradient" x1="100" y1="100" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#059669" /> {/* emerald-600 */}
                            <stop offset="1" stopColor="#0891B2" /> {/* cyan-600 */}
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Shape 1: The Base / Bridge Arch */}
                    <path
                        d="M20 70 C 20 50, 40 40, 60 40 C 80 40, 90 55, 90 70"
                        stroke="url(#bridgeGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        className="opacity-90"
                    />

                    {/* Shape 2: The Rising Leaf / Growth */}
                    {/* Intersects the bridge to form an abstract 'G' or 'Loop' */}
                    <path
                        d="M35 70 C 35 40, 50 10, 80 20 C 60 20, 50 40, 50 70"
                        fill="url(#leafGradient)"
                        className="opacity-100 group-hover:brightness-110 transition-all duration-500"
                    />

                    {/* Accent Dot (The 'Spark' of innovation) */}
                    <circle cx="80" cy="20" r="6" fill="#FBBF24" className="animate-pulse" />
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col justify-center">
                    <span className={`font-bold tracking-tight text-foreground leading-none ${textClasses[size]} font-display`}>
                        GreenBridge
                    </span>
                    {/* Refined tagline logic */}
                    {size !== 'sm' && (
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mt-1">
                            Sustainable Finance
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
