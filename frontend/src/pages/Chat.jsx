import React from 'react';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">AI Assistant</h1>
        <p className="text-slate-500">Ask questions and generate summaries from your documents</p>
      </div>
      
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
