import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User, Key, Loader2, Trash2 } from "lucide-react";
import { generateChatResponse } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export const ChatSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! 👋 I am Alex, your AI Advisor. To get started, please provide your Google Gemini API Key.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [apiKey, setApiKey] = useState(localStorage.getItem("greenbridge_gemini_key") || "");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, isLoading]);

    const handleSaveKey = (key: string) => {
        if (!key.trim()) return;
        localStorage.setItem("greenbridge_gemini_key", key);
        setApiKey(key);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: "Great! I am connected to the GreenBridge brain. Ask me anything about CBAM, credits, or your documents.",
            sender: 'bot',
            timestamp: new Date()
        }]);
    };

    const handleClearKey = () => {
        localStorage.removeItem("greenbridge_gemini_key");
        setApiKey("");
        setMessages([{
            id: Date.now().toString(),
            text: "API Key cleared. Please enter a new key to continue.",
            sender: 'bot',
            timestamp: new Date()
        }]);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim()) return;
        if (!apiKey) {
            handleSaveKey(inputValue);
            setInputValue("");
            return;
        }

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            // Prepare history for context
            const history = messages
                .filter(m => m.id !== '1' && !m.text.includes("API Key")) // Filter out system/setup messages roughly
                .map(m => ({
                    role: m.sender === 'user' ? "user" as const : "model" as const,
                    parts: m.text
                }));

            const responseText = await generateChatResponse(userMsg.text, apiKey, history);

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "I encountered an error connecting to the AI. Please check your API Key.",
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] h-[500px] shadow-2xl border-primary/20 pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col">
                    <CardHeader className="bg-primary/5 border-b py-3 px-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold">GreenBridge AI</CardTitle>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <span className={`block w-1.5 h-1.5 rounded-full animate-pulse ${apiKey ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    {apiKey ? 'Online' : 'Setup Required'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {apiKey && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={handleClearKey} title="Reset API Key">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 flex-1 overflow-hidden relative bg-muted/20">
                        <ScrollArea className="h-full p-4">
                            <div className="flex flex-col gap-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                                            }`}
                                    >
                                        <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-primary/10 text-primary'
                                            }`}>
                                            {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </div>
                                        <div className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.sender === 'user'
                                            ? 'bg-indigo-500 text-white rounded-tr-none'
                                            : 'bg-background border rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-2 max-w-[85%]">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="bg-background border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}
                                {/* Dummy div for auto-scroll */}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 border-t bg-background">
                        {!apiKey ? (
                            <div className="w-full space-y-2">
                                <p className="text-xs text-muted-foreground text-center">🔑 Enter your Google Gemini API Key to enable AI.</p>
                                <form className="flex w-full gap-2" onSubmit={handleSendMessage}>
                                    <div className="relative flex-1">
                                        <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="Paste gemini-pro key..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className="pl-9 focus-visible:ring-indigo-500"
                                        />
                                    </div>
                                    <Button type="submit" disabled={!inputValue.trim()} className="bg-green-600 hover:bg-green-700">
                                        Save
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <form
                                className="flex w-full gap-2"
                                onSubmit={handleSendMessage}
                            >
                                <Input
                                    placeholder="Ask Alex anything..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex-1 focus-visible:ring-indigo-500"
                                    disabled={isLoading}
                                />
                                <Button type="submit" size="icon" disabled={!inputValue.trim() || isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </form>
                        )}
                    </CardFooter>
                </Card>
            )}

            {/* Floating Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white pointer-events-auto transition-transform hover:scale-105"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </Button>
        </div>
    );
};
