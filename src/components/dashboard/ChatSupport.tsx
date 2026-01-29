import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const QA_DATA = [
    {
        keywords: ['greenbridge', 'what is', 'platform'],
        answer: "GreenBridge is a comprehensive comprehensive platform for accurate CBAM compliance, carbon debt calculation, and verified green investments."
    },
    {
        keywords: ['cbam', 'adjustment', 'mechanism'],
        answer: "The Carbon Border Adjustment Mechanism (CBAM) is a tariff on carbon-intensive products entering the EU, designed to prevent carbon leakage."
    },
    {
        keywords: ['carbon credit', 'credit', 'offset'],
        answer: "A carbon credit represents one tonne of CO2 removed or avoided from the atmosphere. You can purchase these to offset your unavoidable emissions."
    },
    {
        keywords: ['invest', 'marketplace', 'projects'],
        answer: "Our Green Investment Marketplace allows you to fund verified global projects (Solar, Forestry, etc.) and receive high-integrity carbon credits in return."
    },
    {
        keywords: ['compliance', 'deadline', 'report'],
        answer: "CBAM compliance involves quarterly reporting of embedded emissions. Our platform automates this tracking and report generation to ensure you meet all deadlines."
    },
    {
        keywords: ['hello', 'hi', 'hey'],
        answer: "Hello! I am the GreenBridge AI Assistant. You can ask me about CBAM, Carbon Credits, or how to use this platform."
    }
];

export const ChatSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! 👋 I can help you with questions about GreenBridge, CBAM compliance, or investing. What's on your mind?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");

        // Process Bot Response
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            let responseText = "Sorry! I cannot assist you with that. Please try asking about CBAM, Carbon Credits, or GreenBridge features.";

            // Simple match logic
            const match = QA_DATA.find(qa =>
                qa.keywords.some(keyword => lowerInput.includes(keyword))
            );

            if (match) {
                responseText = match.answer;
            }

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            }]);
        }, 600);
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
                                <CardTitle className="text-sm font-bold">GreenBridge Support</CardTitle>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <span className="block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
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
                                            <p className={`text-[9px] mt-1 opacity-70 ${msg.sender === 'user' ? 'text-indigo-100' : 'text-muted-foreground'}`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {/* Dummy div for auto-scroll */}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 border-t bg-background">
                        <form
                            className="flex w-full gap-2"
                            onSubmit={handleSendMessage}
                        >
                            <Input
                                placeholder="Type your question..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 focus-visible:ring-indigo-500"
                            />
                            <Button type="submit" size="icon" disabled={!inputValue.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
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
