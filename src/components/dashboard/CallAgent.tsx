import { useState, useEffect, useRef } from 'react';
import { Bot, PhoneOff, Mic, Volume2 } from 'lucide-react';
import { generateChatResponse } from '@/lib/gemini';

interface CallAgentProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CallAgent = ({ isOpen, onClose }: CallAgentProps) => {
    const [callStage, setCallStage] = useState<'setup' | 'connecting' | 'connected'>('setup');
    const [timer, setTimer] = useState(0);
    const [status, setStatus] = useState<string>("Listening...");
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Web Speech API Refs
    const recognition = useRef<any>(null);
    const synthesis = useRef<SpeechSynthesis>(window.speechSynthesis);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isOpen && callStage === 'connected') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);

            // Auto-start listening when connected
            startListening();
        } else {
            setTimer(0);
            stopListening();
            stopSpeaking();
        }
        return () => {
            clearInterval(interval);
            stopListening();
            stopSpeaking();
        };
    }, [isOpen, callStage]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- Voice Logic ---

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            setStatus("Browser not supported for voice.");
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = 'en-US';

        recognition.current.onstart = () => {
            setStatus("Listening...");
        };

        recognition.current.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            setStatus(`You said: "${transcript}"`);
            await processResponse(transcript);
        };

        recognition.current.onerror = (event: any) => {
            console.error(event.error);
            // Restart if it wasn't a manual stop? For now just show error.
            if (callStage === 'connected') setStatus("Listening paused.");
        };

        recognition.current.onend = () => {
            // If still connected and not speaking, restart listening?
            // Usually we restart after speaking finishes.
        };

        try {
            recognition.current.start();
        } catch (e) {
            // Already started
        }
    };

    const stopListening = () => {
        if (recognition.current) {
            recognition.current.stop();
        }
    };

    const stopSpeaking = () => {
        if (synthesis.current) {
            synthesis.current.cancel();
        }
        setIsSpeaking(false);
    };

    const speak = (text: string) => {
        stopSpeaking(); // Cancel any current speech
        setIsSpeaking(true);
        setStatus("Alex is speaking...");

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to find a good voice (Prioritize Indian English as requested)
        const voices = synthesis.current.getVoices();
        // Look for "India" or "Google US English" as fallback
        const preferredVoice = voices.find(v => v.name.includes("India") || v.lang.includes("en-IN") || v.name.includes("Google US English"));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
            setIsSpeaking(false);
            if (callStage === 'connected') {
                setStatus("Listening...");
                try {
                    recognition.current.start();
                } catch (e) { }
            }
        };

        synthesis.current.speak(utterance);
    };

    const processResponse = async (text: string) => {
        setStatus("Thinking...");
        const apiKey = localStorage.getItem("greenbridge_gemini_key");

        if (!apiKey) {
            speak("I need your API Key. Please add it in the chat window first.");
            return;
        }

        try {
            const response = await generateChatResponse(text, apiKey);
            speak(response);
        } catch (error) {
            speak("Sorry, I had trouble connecting. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-primary/20 animate-in fade-in zoom-in-95 duration-300">
                {/* SETUP STAGE */}
                {callStage === 'setup' && (
                    <div className="p-6 space-y-6 text-center">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Bot className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Voice Agent</h3>
                        <p className="text-sm text-muted-foreground">
                            Start a voice conversation with Alex.<br />(Microphone required)
                        </p>

                        <button
                            className="w-full h-12 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg"
                            onClick={() => {
                                setCallStage('connecting');
                                setTimeout(() => setCallStage('connected'), 1500);
                            }}
                        >
                            Start Call
                        </button>
                        <button
                            className="w-full text-sm text-muted-foreground hover:text-foreground mt-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* CONNECTED CALL UI */}
                {callStage !== 'setup' && (
                    <div className="bg-gradient-to-b from-indigo-900/10 to-transparent p-8 flex flex-col items-center justify-center space-y-6 h-[400px]">

                        {/* Avatar */}
                        <div className="relative">
                            <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl ${isSpeaking ? 'animate-pulse scale-105 transition-transform' : ''}`}>
                                <Bot className="h-14 w-14 text-white" />
                            </div>
                            {isSpeaking && (
                                <>
                                    <span className="absolute -inset-2 rounded-full border-2 border-indigo-500 animate-ping opacity-50"></span>
                                    <span className="absolute -inset-4 rounded-full border border-purple-500 animate-pulse opacity-30"></span>
                                </>
                            )}
                        </div>

                        {/* Status Typewriter */}
                        <div className="text-center space-y-2 w-full">
                            <h3 className="text-2xl font-bold tracking-tight">Alex</h3>
                            <p className="text-sm font-mono text-indigo-500 dark:text-indigo-400 font-medium h-6">
                                {status}
                            </p>

                            {callStage === 'connected' && (
                                <p className="text-xl font-mono text-muted-foreground mt-2">
                                    {formatTime(timer)}
                                </p>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="pt-4 flex gap-6">
                            <button
                                className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${isSpeaking ? 'bg-muted' : 'bg-green-100 text-green-700'}`}
                                title="Listening Status"
                            >
                                <Mic className="h-5 w-5" />
                            </button>

                            <button
                                className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-105 transition-all"
                                onClick={() => {
                                    stopSpeaking();
                                    stopListening();
                                    onClose(); // Close immediately on hangup for smoother UX
                                }}
                            >
                                <PhoneOff className="h-8 w-8 text-white" />
                            </button>

                            <button className="h-12 w-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                                <Volume2 className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
