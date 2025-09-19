import React, { useState } from 'react';

const SlidingPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  const handleDropZoneClick = () => {
    // Simulate file input click (implement as needed)
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file drop (implement as needed)
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setIsLoading(true);
      setMessages([...messages, { sender: 'user', text: inputValue }]);
      setInputValue('');
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'Model generated!' }]);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 px-4 py-2 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 active:bg-green-600 transition-all duration-200 z-50"
      >
        {isOpen ? 'Hide Panel' : 'Show Panel'}
      </button>

      {/* Sliding Panel */}
      <div
        className={`
          w-80 bg-grey-900 bg-opacity-80 border-r-2 border-green-400 flex flex-col backdrop-blur-sm
          fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-green-400 border-opacity-30">
          <h2 className="text-xl font-bold text-center text-green-300 mb-4 drop-shadow-lg">
             3D AI Generator
          </h2>

          {/* Drag & Drop Zone */}
          <div
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 mb-4
              ${isDragOver
                ? 'border-green-300 bg-green-900 bg-opacity-30 text-green-300'
                : 'border-green-400 border-opacity-50 text-green-400 hover:border-green-300 hover:bg-green-900 hover:bg-opacity-20'
              }
            `}
          >
            <div className="text-sm">
              <div className="mb-1"> Drop GLB File</div>
              <div className="text-xs opacity-70">or click to browse</div>
            </div>
          </div>
        </div>

        {/* 3D Model Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800 bg-opacity-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`
                p-3 rounded-lg text-sm leading-relaxed
                ${message.sender === 'user'
                  ? 'bg-green-600 bg-opacity-20 text-green-300 border-l-4 border-green-400'
                  : 'bg-gray-700 bg-opacity-30 text-green-200'
                }
              `}
            >
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
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="flex-1 bg-gray-800 border border-green-400 border-opacity-50 rounded-lg px-3 py-2 text-green-300 placeholder-green-600 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300"
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className={`
                px-4 py-2 rounded-lg font-semibold transition-all duration-200
                ${isLoading || !inputValue.trim()
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
    </div>
  );
};

export default SlidingPanel;