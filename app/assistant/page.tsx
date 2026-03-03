'use client';

import React, { useEffect, useRef } from "react"
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Lightbulb, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from "sonner"

interface ChatMessage {
  _id?: string;
  id?: number | string;
  type: 'user' | 'ai';
  content: string;
  createdAt?: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Explain React hooks to me",
    "Help me with TypeScript generics",
    "What's the best way to structure APIs?",
    "How do I optimize database queries?",
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat history and suggestions
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const historyRes = await api.getChatHistory();
        if (historyRes.success && historyRes.data) {
          setMessages(historyRes.data as ChatMessage[]);
        }

        const suggestionsRes = await api.getSuggestions();
        if (suggestionsRes.success && suggestionsRes.data) {
          setSuggestions(suggestionsRes.data as string[]);
        }
      } catch (error) {
        console.error("Failed to load assistant data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();

    // Optimistically add user message
    const userMsg: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: userInput,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await api.sendMessage(userInput);
      if (result.success && result.data) {
        const data = result.data as any;
        // Backend returns AI message in result.data.aiMessage
        const aiMsg: ChatMessage = data.aiMessage || {
          id: Date.now() + 1,
          type: 'ai',
          content: data.content || "I'm sorry, I couldn't generate a response."
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        toast.error(result.error || "Failed to get AI response");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (!confirm("Are you sure you want to clear your chat history?")) return;

    try {
      const result = await api.clearChatHistory();
      if (result.success) {
        setMessages([]);
        toast.success("Chat history cleared");
      }
    } catch (error) {
      toast.error("Failed to clear chat");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Focus the input field? Or just send it?
    // Let's just set it and let user click send for better UX (editing possible)
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">AI Learning Assistant</h2>
          <p className="text-muted-foreground">
            Get instant help, explanations, and guidance from your personal AI tutor
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearChat} className="text-destructive border-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        )}
      </div>

      <Card className="h-[600px] flex flex-col border-border shadow-md">
        {/* Chat Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center opacity-70">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold mb-2">Ready to Learn?</h3>
                <p className="text-muted-foreground max-w-sm">
                  Ask a question above or choose a suggestion below to start your learning session.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, idx) => (
                <div
                  key={message._id || message.id || idx}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none border border-border/50'
                      }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-bl-none shadow-sm animate-pulse">
                    <div className="flex gap-1.5 h-4 items-center">
                      <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" />
                      <div
                        className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-border p-6 space-y-5 bg-muted/20">
          {!isLoading && messages.length <= 1 && (
            <div className="animate-in fade-in zoom-in duration-500">
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                Quick Suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left text-xs px-3 py-2 rounded-full border border-border bg-background hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a technical question..."
              className="flex-1 px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all pr-12"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1 top-1 bottom-1 h-auto aspect-square rounded-lg p-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground/60">
            Powered by your AI Learning Tutor. Questions are persisited to your profile.
          </p>
        </div>
      </Card>
    </DashboardLayout>
  );
}
