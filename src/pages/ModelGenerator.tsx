import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import bgimg from '/src/assets/Gemini_Generated_Image_9cm8iv9cm8iv9cm8.png'
import modelbg from '/src/assets/modelbg.jpg'
import { useLocation } from 'react-router-dom';
import bg from '/src/assets/bg.png'
// Load model-viewer component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer.d': any;
    }
  }
}

interface Message {
  text: string;
  sender: 'user' | 'server';
}

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface TaskData {
  task_id?: string;
  status?: string;
  error?: string;
  model_url?: string;
  data?: {
    result?: {
      pbr_model?: {
        url?: string;
      };
    };
  };
}

const IntegratedModelGenerator: React.FC = () => {
  const location = useLocation();
  const fishquery = location.state?.query || "";
  // 3D Model Generator States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModelURL, setCurrentModelURL] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [search, setsearch] = useState(false);
  const [Responses, setResponses] = useState<string[]>([]);
  // Chatbot States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI assistant. Ask me anything about your 3D models or general questions!",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Refs
  const eventSourceRef = useRef<EventSource | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const API_BASE_URL = 'https://sih2-mcg2.onrender.com';

  // Load model-viewer script
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Auto-scroll chat messages (both chats)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (currentModelURL) {
        URL.revokeObjectURL(currentModelURL);
      }
    };
  }, [currentModelURL]);

  // Auto-resize chat input
  const handleChatInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto';
      chatInputRef.current.style.height = Math.min(chatInputRef.current.scrollHeight, 100) + 'px';
    }
  };

  // 3D Model Generator Functions
  const appendMessage = (text: string, sender: 'user' | 'server' = 'server') => {
    setMessages(prev => [...prev, { text, sender }]);
  };
  const [generated, setgenerated] = useState(false)
  const handleSubmit = async (e?: React.MouseEvent, overridePrompt?: string) => {
    if (e) e.preventDefault();
    const prompt = overridePrompt ? overridePrompt.trim() : inputValue.trim();
    if (!prompt) return;

    appendMessage(`> ${prompt}`, 'user');
    setIsLoading(true);
    appendMessage('🚀 Creating 3D model task...', 'server');

    // Also notify chatbot about the model generation
    const newChatMessage: ChatMessage = {
      id: Date.now(),
      type: 'bot',
      content: `working on generating your model...`,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newChatMessage]);

    try {
      const response = await fetch(`${API_BASE_URL}/generate/text-to-3d`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model_version: 'v2.5-20250123' })
      });

      if (!response.ok) {
        const errorText = await response.text();
        appendMessage(`❌ Error from backend: ${errorText}`, 'server');
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      if (result.task_id) {
        setCurrentTaskId(result.task_id);
        appendMessage(`✅ Task created: ${result.task_id}`, 'server');
        startTaskStream(result.task_id);
      } else {
        appendMessage('❌ Backend did not return a task ID.', 'server');
      }
    } catch (err) {
      appendMessage(`❌ Network/server error: ${err}`, 'server');
    }

    setIsLoading(false);
    setInputValue('');
  };

  const startTaskStream = (taskId: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    appendMessage('📡 Listening for task updates...', 'server');
    eventSourceRef.current = new EventSource(`${API_BASE_URL}/tasks/${taskId}/stream`);

    eventSourceRef.current.onmessage = (event) => {
      try {
        const data: TaskData = JSON.parse(event.data);

        if (data.error) {
          appendMessage(` Stream error: ${data.error}`, 'server');
          eventSourceRef.current?.close();
          return;
        }

        if (data.status) {
          appendMessage(` Status: ${data.status}`, 'server');

          if (data.status === 'success' || data.status === 'completed') {
            const modelUrl = data.model_url || data.data?.result?.pbr_model?.url || null;
            if (modelUrl) {
              displayModel(modelUrl, `generated_model_${taskId}`);
              appendMessage(' Model ready and loaded.', 'server');
              setgenerated(true);
              setShowModel(false);

              // Notify chatbot about successful generation
              const successMessage: ChatMessage = {
                id: Date.now(),
                type: 'bot',
                content: ' Great! Your 3D model has been generated successfully! Would you like to know more about it or need help with anything else?',
                timestamp: new Date()
              };
              setChatMessages(prev => [...prev, successMessage]);

              eventSourceRef.current?.close();
            } else {
              appendMessage('❌ No model URL provided from backend.', 'server');
            }
          } else if (data.status === 'failed' || data.status === 'cancelled') {
            appendMessage(`💥 Task ${data.status}`, 'server');
            eventSourceRef.current?.close();
          }
        }
      } catch (err) {
        appendMessage('❌ Failed to parse stream data.', 'server');
      }
    };

    eventSourceRef.current.onerror = () => {
      appendMessage('⚠ Connection lost.', 'server');
      eventSourceRef.current?.close();
    };
  };

  const displayModel = (url: string, fileName: string = '') => {
    if (currentModelURL) {
      URL.revokeObjectURL(currentModelURL);
    }
    setCurrentModelURL(url);
    setCurrentFileName(fileName);
  };

  const handleBack = () => {
    setShowModel(false);
    if (currentModelURL) {
      URL.revokeObjectURL(currentModelURL);
    }
    setCurrentModelURL(null);
    setCurrentTaskId(null);
    setCurrentFileName('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) {
      appendMessage(' No files dropped.', 'server');
      return;
    }

    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.glb')) {
      appendMessage(' Please drop a valid .glb file.', 'server');
      return;
    }

    loadLocalModel(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.glb')) {
        loadLocalModel(file);
      } else {
        appendMessage(' Please select a valid .glb file.', 'server');
      }
    }
  };

  const loadLocalModel = (file: File) => {
    if (currentModelURL) {
      URL.revokeObjectURL(currentModelURL);
    }

    const objectURL = URL.createObjectURL(file);
    setgenerated(false);
    setShowModel(true);

    displayModel(objectURL, file.name);
    setCurrentTaskId(null);
    appendMessage(`📥 Loaded local model: ${file.name}`, 'server');

    // Notify chatbot about loaded file
    const fileMessage: ChatMessage = {
      id: Date.now(),
      type: 'bot',
      content: `📥 I see you've loaded a 3D model file: "${file.name}". Would you like me to help you analyze it or answer any questions about it?`,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, fileMessage]);
  };

  const handleDownload = () => {
    if (!currentModelURL) return;

    const a = document.createElement('a');
    a.href = currentModelURL;
    a.download = currentFileName || `model_${currentTaskId || Date.now()}.glb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };
  useEffect(() => {
      if (fishquery) {
        sendChatMessage(fishquery);
      }
    }, [fishquery])
  // Chatbot Functions
  const sendChatMessage = async (q=null) => {
    let message = chatInput.trim() ||q;
    if (!message) return;
    let m = "";
    if (message.toLowerCase().includes("generate")) {
      m = message.replace("generate", "details on");
      m = m.trim();
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    m = m ? m : message;
    // Add loading message
    const loadingMessage: ChatMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: 'Thinking...',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, loadingMessage]);
    setIsChatLoading(true);

    try {
      const modelContext = inputValue ? `Current 3D model prompt: "${inputValue}". ` : '';
      const fileContext = currentFileName ? `Current 3D model file: "${currentFileName}". ` : '';

      const res = await fetch(`${API_BASE_URL}/gemini/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are an AI assistant helping users with 3D modeling. ${modelContext}${fileContext}User question: ${m}`
        })
      });

      // Remove loading message and add response
      setChatMessages(prev => prev.slice(0, -1));

      if (!res.ok) {
        const errorMessage: ChatMessage = {
          id: Date.now(),
          type: 'bot',
          content: `Sorry, I encountered an error: ${res.status} ${res.statusText}`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
        return;
      }

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: Date.now(),
        type: 'bot',
        content: data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
      if (message.toLowerCase().includes("generate")) {
        const fullPrompt = data.response;
        setInputValue(fullPrompt);
        handleSubmit(undefined, fullPrompt); // pass prompt directly
      }
    } catch (e: any) {
      // Remove loading message and add error
      setChatMessages(prev => prev.slice(0, -1));
      const errorMessage: ChatMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Network error: ${e.message}`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <div className="h-screen bg-white from-gray-900 via-gray-800 to-black text-green-800 flex overflow-hidden font-mono" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
      {/* Left Panel - 3D Model Chat */}

      {search && (
        <div className="w-80 bg-gray-100 bg-opacity-80 border-r-2 border-green-400 flex flex-col backdrop-blur-sm">
          <div className="p-4 border-b border-green-400 border-opacity-30">
            <h2 className="text-xl font-bold text-center text-green-800 mb-4 drop-shadow-lg">
              Debugging Window
            </h2>

            {/* Always visible drag & drop zone */}
            
          </div>

          {/* 3D Model Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-500 bg-opacity-50">
            {messages.map((message, index) => (
              <div key={index} className={`
              p-3 rounded-lg text-sm leading-relaxed
              ${message.sender === 'user'
                  ? 'bg-green-600 bg-opacity-20 text-green-300 border-l-4 border-green-900'
                  : 'bg-zinc-700 bg-opacity-30 text-white'
                }
            `}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 3D Model Input */}
          <div className="p-4 border-t border-green-400 border-opacity-30">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your 3D model..."
                onKeyDown={(e) => {
                  if (inputValue.trim().includes("generate")) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setChatInput(inputValue);
                      sendChatMessage();
                    }
                  }
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                    /* setChatInput(inputValue);
                    sendChatMessage(); */
                  }
                }}
                className="flex-1 bg-gray-200 border border-green-800 border-opacity-50 rounded-lg px-3 py-2 text-green-800 placeholder-green-800 focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !inputValue.trim()}
                className={`
                px-4 py-2 rounded-lg font-semibold transition-all duration-200
                ${(isLoading || !inputValue.trim())
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-black hover:bg-green-400 active:bg-green-600'
                  }
              `}
              >
                {isLoading ? '⏳' : '🚀'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Center - Model Viewer */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-black flex flex-col" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
        {/* Header */}
        <div className="p-6 border-b border-green-400 border-opacity-30 bg-slate-800 to-blue-100 bg-opacity-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-400 drop-shadow-lg">
              3D Model Viewer
            </h2>
            {showModel && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                ← Back
              </button>
            )}
          </div>
        </div>

        {/* Model Viewer or Welcome Screen */}
        <div className="flex-1 p-6 h-full w-full bg-blue-200" style={{ backgroundImage: `url(${modelbg})`, backgroundSize: 'cover' }} >
          {!showModel ? (
            <div
              onClick={handleDropZoneClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 mb-4
              ${isDragOver
                  ? 'border-white bg-green-900 bg-opacity-30 text-white'
                  : 'border-green-900 border-opacity-50 text-white hover:border-white hover:bg-green-900 hover:bg-opacity-20'
                }
            `}
            >
              <div className="text-sm">
                <div className="mb-1">Drop GLB File</div>
                <div className="text-xs opacity-70">or click to browse</div>
              </div>
            </div>

          ) :
            (
              <div className="h-full flex flex-col space-y-4 justify-center p-0 items-center">
                <model-viewer
                  src={currentModelURL}
                  alt="3D Model Preview"
                  camera-controls={true}
                  auto-rotate={true}
                  shadow-intensity="1"
                  environment-image="neutral"
                  exposure="1"
                  ar={true}
                  className="flex-1 rounded-xl h-full shadow-2xl border border-green-400 border-opacity-30"
                  style={{
                    height: '100%',
                    minHeight: '60vh',
                    backgroundColor: 'white',
                    width: '100%',
                  }}
                />

                {/* Model Info & Download */}
                {/* {!showModel && (
                <div className="flex items-center justify-between bg-gray-800 bg-opacity-50 rounded-lg p-4 w-4/5">
                  <div className="text-green-300">
                    <div className="font-semibold">📦 {currentFileName || 'Generated Model'}</div>
                    <div className="text-sm text-green-400 opacity-70">
                      {currentTaskId ? `Task: ${currentTaskId}` : 'Local file'}
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    📥 Download GLB
                  </button>
                </div>)} */}
              </div>
            )}
          {generated && (
            <div className="flex items-center justify-between bg-gray-800 bg-opacity-50 rounded-lg p-4 w-4/5">
              <div className="text-green-300">
                <div className="font-semibold">📦 {currentFileName || 'Generated Model'}</div>
                <div className="text-sm text-green-400 opacity-70">
                  {currentTaskId ? `Task: ${currentTaskId}` : 'Local file'}
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                Download GLB
              </button>
            </div>
          )}

        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".glb"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button onClick={() => { setsearch(!search) }} style={{ position: 'absolute', top: '70%' }}>{search ? '<<' : '>>'}</button>
      </div>
      {/* <button onClick={() => { setsearch(!search) }} style={{ position: 'absolute', top: '70%' }}>{search ? '<<' : '>>'}</button> */}
      {/* Right Panel - AI Chatbot */}
      <div className="w-96 bg-opacity-95 border-l border-green-500 border-opacity-30 flex flex-col backdrop-blur-sm" style={{ background: 'transparent' }}>
        <div className="bg-blue-200 p-6 border-b border-green-500 border-opacity-30" style={{ height: '12.5%' }}>
          <h2 className="text-green-600 text-xl font-semibold text-center">
            AI Assistant
          </h2>
        </div>

        <div
          ref={chatMessagesRef}
          className="flex-1 p-4 overflow-y-auto scroll-smooth"
        >
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-4 rounded-xl max-w-[90%] break-words animate-fadeIn ${message.type === 'user'
                ? 'bg-white bg-opacity-40 border-2  border-white border-opacity-90 ml-auto text-black'
                : 'bg-gray-800 bg-opacity-90 border border-white border-opacity-10 text-white'
                } ${message.content === 'Thinking...' ? 'animate-pulse text-green-400' : ''}`}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-green-500 border-opacity-30">
          <div className="flex gap-2">
            <textarea
              ref={chatInputRef}
              value={chatInput}
              onChange={(e) => {
                handleChatInputChange(e);
              }}
              onKeyDown={handleChatKeyPress}
              className="flex-1  bg-opacity-90 border border-green-500 border-opacity-30 rounded-lg text-black p-3 text-sm resize-none  transition-all duration-300 focus:outline-none focus:border-green-400 focus:shadow-sm focus:shadow-green-400/20 overflow-y-auto"
              placeholder="Ask me anything ocean related..."
              rows={1}
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            />
            <button
              onClick={
                sendChatMessage
              }
              disabled={isChatLoading}
              className="bg-gradient-to-r from-green-400 to-green-300 text-black border-none rounded-lg px-4 py-3 font-bold cursor-pointer transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          
          .w-80, .w-96 {
            width: 100%;
            height: 250px;
          }
          
          .flex-1 {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default IntegratedModelGenerator;