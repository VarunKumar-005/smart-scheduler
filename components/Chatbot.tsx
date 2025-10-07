
import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

const initialHistory: ChatMessage[] = [{
  role: 'model',
  text: 'Hi there! I am your AI Career Counselor. Ask me anything about the career domains in this app, or tell me your interests, and I can suggest a path for you. How can I help you today?'
}];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>(initialHistory);
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('chatInput') as HTMLInputElement;
    const messageText = input.value.trim();

    if (!messageText || isLoading) return;

    setHistory(prev => [...prev, { role: 'user', text: messageText }]);
    setIsLoading(true);
    input.value = '';

    try {
      if (!chatSession.current) {
        chatSession.current = createChatSession();
      }
      const stream = await chatSession.current.sendMessageStream({ message: messageText });

      setIsLoading(false);
      
      let buffer = '';
      setHistory(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        buffer += chunk.text;
        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: 'model', text: buffer };
            return newHistory;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setHistory(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-apple-blue text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 z-50 transition-all duration-300 ease-out ${isOpen ? 'opacity-0 scale-95 pointer-events-none' : ''}`}
        aria-label="Open AI Career Counselor"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" /><path d="M16 14H8.333a1 1 0 00-.786.375l-2.11 2.637A1 1 0 014.28 16H4a2 2 0 01-2-2v-1a1 1 0 011-1h12a1 1 0 110 2z" /></svg>
      </button>

      <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ease-out origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-white dark:bg-gray-800 w-full h-[85vh] sm:w-[380px] sm:h-[70vh] sm:max-h-[650px] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-apple-blue rounded-full flex items-center justify-center text-white font-bold text-lg font-space">AI</div>
              <div>
                <h2 className="font-bold font-poppins text-lg dark:text-white">AI Career Counselor</h2>
                <p className="text-sm text-apple-gray dark:text-gray-400">Learn2Earn</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-apple-gray hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors" aria-label="Close chat"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
            {history.map((message, index) => (
              <div key={index} className={`max-w-[85%] word-wrap break-word p-3 rounded-xl ${message.role === 'user' ? 'bg-apple-blue text-white self-end' : 'bg-apple-light text-black dark:bg-gray-700 dark:text-white self-start'}`}>
                {message.role === 'model' ? <MarkdownRenderer text={message.text} /> : <p>{message.text}</p>}
              </div>
            ))}
            {isLoading && (
              <div className="bg-apple-light text-black dark:bg-gray-700 dark:text-white self-start p-3 rounded-xl">
                 <div className="inline-block w-2 h-4 bg-apple-dark dark:bg-white animate-ping ml-1" style={{animationDuration: '1s'}}></div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input type="text" id="chatInput" name="chatInput" placeholder="Ask about a career path..." className="flex-1 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition" autoComplete="off" />
              <button type="submit" disabled={isLoading} className="bg-apple-blue text-white rounded-lg p-3 disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
