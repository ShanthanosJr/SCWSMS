import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
//import Nav from "../Nav/Nav";

export default function ChatBot() {
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // State management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [knowledgeCategories, setKnowledgeCategories] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // Enhanced FontAwesome loading
  useEffect(() => {
    const loadFontAwesome = () => {
      const existingLink = document.querySelector('link[href*="font-awesome"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        link.onload = () => console.log('✅ FontAwesome loaded successfully');
        link.onerror = () => {
          console.warn('⚠️ FontAwesome failed to load, using fallbacks');
          document.body.classList.add('fontawesome-fallback');
        };
      }
    };
    loadFontAwesome();
  }, []);

  // Initialize component
  useEffect(() => {
    initializeChat();
    loadKnowledgeCategories();
    initVoiceRecognition();
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice Recognition Setup
  const initVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';
    recognitionInstance.onstart = () => {
      setIsVoiceActive(true);
    };
    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsVoiceActive(false);
    };
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsVoiceActive(false);
    };
    recognitionInstance.onend = () => {
      setIsVoiceActive(false);
    };
    setRecognition(recognitionInstance);
  };

  const toggleVoice = () => {
    if (!recognition) {
      alert('Voice recognition not supported in your browser');
      return;
    }
    if (isVoiceActive) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // Initialize chat with mock data since API might not exist
  const initializeChat = async () => {
    try {
      setIsLoading(true);
      console.log('🤖 Initializing Projecto chat conversation...');
      setIsConnected(true);
      const welcomeMessage = {
        messageId: 'welcome',
        sender: 'bot',
        message: "Welcome to Projecto! I'm your AI-powered construction assistant, ready to help with blueprints, planning, cost analysis, and project management. How can I assist you today?",
        timestamp: new Date(),
        messageType: 'greeting'
      };
      setMessages([welcomeMessage]);
      setSuggestions([
        'Calculate material costs for my project',
        'Help me create a project timeline',
        'Suggest eco-friendly construction materials',
        'Analyze building code requirements',
        'Optimize my construction budget'
      ]);
      console.log('✅ Projecto chat initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing chat:', error);
      setIsConnected(false);
      const fallbackMessage = {
        messageId: 'fallback',
        sender: 'bot',
        message: "Hello! I'm Projecto, running in offline mode. I can still help you with construction advice, calculations, and planning guidance. What would you like to know?",
        timestamp: new Date(),
        messageType: 'info'
      };
      setMessages([fallbackMessage]);
      setSuggestions([
        'Show me construction best practices',
        'Help with project planning',
        'Calculate basic material needs',
        'Safety guidelines and tips'
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load knowledge categories with fallback data
  const loadKnowledgeCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5050/chatbot/knowledge/categories');
      setKnowledgeCategories(response.data.data || []);
    } catch (error) {
      console.warn('API not available, using mock knowledge categories');
      const mockCategories = [
        {
          id: 1,
          name: 'Building Materials',
          description: 'Concrete, steel, lumber, and sustainable options',
          icon: 'fas fa-building'
        },
        {
          id: 2,
          name: 'Project Planning',
          description: 'Timeline management and resource allocation',
          icon: 'fas fa-calendar-alt'
        },
        {
          id: 3,
          name: 'Cost Estimation',
          description: 'Budgeting tools and price calculations',
          icon: 'fas fa-calculator'
        },
        {
          id: 4,
          name: 'Safety Guidelines',
          description: 'Construction safety and regulations',
          icon: 'fas fa-hard-hat'
        },
        {
          id: 5,
          name: 'Design Principles',
          description: 'Architectural and structural design basics',
          icon: 'fas fa-drafting-compass'
        }
      ];
      setKnowledgeCategories(mockCategories);
    }
  };

  // Enhanced message sending with mock responses
  const sendMessage = async (messageText = null) => {
    const message = messageText || inputMessage.trim();
    if (!message) return;
    try {
      setIsTyping(true);
      setInputMessage("");
      setMessageCount(prev => prev + 1);
      const userMessage = {
        messageId: `user-${Date.now()}`,
        sender: 'user',
        message: message,
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => [...prev, userMessage]);
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      const botResponse = generateMockResponse(message);
      setMessages(prev => [...prev, botResponse]);
      updateSuggestions(message);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      const errorMessage = {
        messageId: `error-${Date.now()}`,
        sender: 'bot',
        message: "I apologize, but I encountered an issue processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        messageType: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate intelligent mock responses
  const generateMockResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    let response = "";
    let messageType = "guidance";
    if (message.includes('cost') || message.includes('budget') || message.includes('price')) {
      response = "For accurate cost estimation, I recommend breaking down your project into these categories: materials (40-50%), labor (30-40%), permits and fees (5-10%), and contingency (10-15%). Would you like me to help calculate costs for a specific aspect of your project?";
      messageType = "calculation";
    } else if (message.includes('material') || message.includes('concrete') || message.includes('steel')) {
      response = "Here are some key material considerations: Concrete is ideal for foundations (expect 28-day curing), steel offers excellent tensile strength for structural elements, and engineered lumber provides sustainable alternatives. What specific materials are you considering for your project?";
      messageType = "knowledge";
    } else if (message.includes('timeline') || message.includes('schedule') || message.includes('planning')) {
      response = "Effective project planning follows these phases: 1) Design & Permits (2-8 weeks), 2) Site Preparation (1-2 weeks), 3) Foundation (1-3 weeks), 4) Framing (2-6 weeks), 5) Systems Installation (3-5 weeks), 6) Finishing (4-8 weeks). Each phase depends on project size and complexity.";
      messageType = "guidance";
    } else if (message.includes('safety') || message.includes('regulation') || message.includes('code')) {
      response = "Safety is paramount in construction. Key requirements include: proper PPE (hard hats, safety glasses, steel-toed boots), fall protection for work above 6 feet, OSHA compliance for scaffolding, and regular safety meetings. Always check local building codes for specific requirements.";
      messageType = "knowledge";
    } else if (message.includes('sustainable') || message.includes('green') || message.includes('eco')) {
      response = "Sustainable construction options include: recycled steel and concrete, bamboo flooring, low-VOC paints, energy-efficient windows, and renewable insulation materials like sheep's wool or recycled denim. These choices can reduce environmental impact while often providing long-term cost savings.";
      messageType = "suggestion";
    } else {
      response = "I'm here to help with your construction project! I can assist with cost estimation, material selection, project planning, safety guidelines, and sustainable building practices. Could you provide more specific details about what you're working on?";
      messageType = "guidance";
    }
    return {
      messageId: `bot-${Date.now()}`,
      sender: 'bot',
      message: response,
      timestamp: new Date(),
      messageType: messageType
    };
  };

  // Update suggestions based on context
  const updateSuggestions = (message) => {
    const msg = message.toLowerCase();
    let newSuggestions = [];
    if (msg.includes('cost') || msg.includes('budget')) {
      newSuggestions = [
        'Break down material costs by category',
        'Calculate labor cost estimates',
        'Factor in permit and inspection fees',
        'Plan for cost overruns and contingencies'
      ];
    } else if (msg.includes('material')) {
      newSuggestions = [
        'Compare material durability ratings',
        'Find sustainable material alternatives',
        'Calculate material quantities needed',
        'Check material delivery schedules'
      ];
    } else if (msg.includes('timeline') || msg.includes('planning')) {
      newSuggestions = [
        'Create detailed project milestones',
        'Plan for weather delays',
        'Coordinate contractor schedules',
        'Set up progress tracking system'
      ];
    } else {
      newSuggestions = [
        'Help me estimate project costs',
        'What materials work best for my climate?',
        'Create a realistic project timeline',
        'Ensure my project meets safety standards'
      ];
    }
    setSuggestions(newSuggestions);
  };

  // Event handlers
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    sendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const message = `I've uploaded "${file.name}" for analysis. This file contains ${file.type.includes('image') ? 'images' : 'documents'} related to my construction project.`;
      sendMessage(message);
    }
  };

  const exportChat = () => {
    const chatText = messages.map(msg =>
      `${msg.sender === 'user' ? 'You' : 'Projecto'}: ${msg.message}\nTime: ${formatTimestamp(msg.timestamp)}\n`
    ).join('\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projecto-construction-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  const openKnowledgeCategory = (category) => {
    const message = `Tell me about ${category.name.toLowerCase()} in construction projects`;
    sendMessage(message);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getBotMessageIcon = (messageType) => {
    const icons = {
      'knowledge': '📚',
      'calculation': '🧮',
      'guidance': '💡',
      'data': '📊',
      'suggestion': '💭',
      'error': '⚠️',
      'greeting': '👋',
      'info': 'ℹ️'
    };
    return icons[messageType] || '🏗️';
  };

  const getMessageTypeColor = (messageType) => {
    const colors = {
      'knowledge': '#17a2b8',
      'calculation': '#28a745',
      'guidance': '#ffc107',
      'data': '#007bff',
      'suggestion': '#6f42c1',
      'error': '#dc3545',
      'greeting': '#d4af37',
      'info': '#6c757d'
    };
    return colors[messageType] || '#6c757d';
  };

  // Loading screen
  if (isLoading) {
    return (
      <div style={{ backgroundColor: darkMode ? '#1f2937' : '#fdfcfb', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
        {/*<Nav />*/}
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className={`card shadow-lg border-0 ${darkMode ? 'bg-dark text-white' : ''}`} style={{ borderRadius: '24px' }}>
                <div className="card-body p-5">
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4 className={darkMode ? 'text-light' : 'text-muted'}>Initializing Projecto...</h4>
                  <p className={darkMode ? 'text-light-secondary' : 'text-secondary'}>Setting up your construction AI assistant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: darkMode ? '#1f2937' : '#fdfcfb', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', transition: 'background-color 0.3s ease' }}>
      {/*<Nav />*/}
      {/* Premium Projecto Header */}
      <section className="container-fluid px-4 py-5" style={{
        background: darkMode ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' : 'linear-gradient(135deg, #fdfcfb 0%, #f8f7f4 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: darkMode ? 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)' : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        <div className="row justify-content-center position-relative">
          <div className="col-lg-10">
            <div className={`text-center mb-5 ${darkMode ? 'text-light' : ''}`} style={{
              borderRadius: '24px',
              padding: '4rem 3rem',
              background: darkMode ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.9) 0%, rgba(55, 65, 81, 0.8) 100%)' : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 252, 251, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: darkMode ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                  marginRight: '1rem'
                }}>
                  <i className="fas fa-hard-hat text-white fs-1"></i>
                </div>
                <div>
                  <h1 className="display-3 fw-bold mb-1" style={{
                    color: darkMode ? '#f9fafb' : '#1a1a1a',
                    fontWeight: '700',
                    letterSpacing: '-0.02em'
                  }}>Projecto AI</h1>
                  <p className="h5" style={{ color: darkMode ? '#d1d5db' : '#6b7280', fontWeight: '300' }}>
                    Construction Intelligence Assistant • Smart. Reliable. Ready to Build.
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                <div className={`badge ${isConnected ? 'bg-success' : 'bg-warning'} px-3 py-2`}>
                  <i className={`fas ${isConnected ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                  {isConnected ? 'Connected' : 'Offline Mode'}
                </div>
                <div className="badge bg-info px-3 py-2">
                  <i className="fas fa-comments me-2"></i>
                  {messageCount} Messages
                </div>
              </div>
              <p className={`lead mb-4 ${darkMode ? 'text-light-secondary' : ''}`} style={{
                color: darkMode ? '#d1d5db' : '#6b7280',
                fontSize: '1.25rem',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Your AI-powered construction companion. Get expert advice on materials, costs, timelines, and project management with intelligent insights tailored to your needs.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold"
                  style={{
                    borderRadius: '50px',
                    border: darkMode ? '2px solid #3b82f6' : '2px solid #3b82f6',
                    color: '#3b82f6',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: darkMode ? '0 4px 15px rgba(59, 130, 246, 0.3)' : '0 4px 15px rgba(59, 130, 246, 0.2)'
                  }}
                  onClick={() => setShowKnowledgePanel(!showKnowledgePanel)}
                >
                  <i className="fas fa-book me-2"></i>Knowledge Base
                </button>
                <button
                  className={`btn btn-primary btn-lg px-5 py-3 fw-semibold ${darkMode ? 'bg-dark text-light' : ''}`}
                  style={{
                    borderRadius: '50px',
                    background: darkMode ? 'linear-gradient(135deg, #374151 0%, #4b5563 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: darkMode ? '0 4px 20px rgba(55, 65, 81, 0.4)' : '0 4px 20px rgba(59, 130, 246, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={toggleDarkMode}
                >
                  <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} me-2`}></i>{darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={`container-fluid ${darkMode ? 'dark-mode' : ''}`} style={{ paddingBottom: '2rem' }}>
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            {/* Enhanced Projecto Chat Container */}
            <div className={`card shadow-xl border-0 ${darkMode ? 'bg-dark text-light' : ''}`} style={{
              borderRadius: '24px',
              height: '70vh',
              background: darkMode ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(55, 65, 81, 0.95) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden'
            }}>
              {/* Projecto Header with Controls */}
              <div className="d-flex align-items-center justify-content-between p-4" style={{
                background: darkMode ? 'linear-gradient(45deg, #374151, #4b5563)' : 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                color: '#fff',
                borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
              }}>
                <div className="d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3" style={{ backdropFilter: 'blur(10px)' }}>
                    <i className="fas fa-hard-hat text-blue" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Projecto: Construction AI</h5>
                    <small className="opacity-90">Your Intelligent Building Assistant</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => setShowKnowledgePanel(!showKnowledgePanel)}
                    style={{ background: 'transparent', border: 'none' }}
                    title="Knowledge Base"
                  >
                    <i className="fas fa-book"></i>
                  </button>
                  <button
                    className="btn btn-sm text-white"
                    onClick={exportChat}
                    style={{ background: 'transparent', border: 'none' }}
                    title="Export Chat"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  <div className={`bg-${isConnected ? 'success' : 'warning'} rounded-circle`} style={{ width: '12px', height: '12px', opacity: 0.8 }} title={isConnected ? 'Connected' : 'Offline'}></div>
                </div>
              </div>
              {/* Messages Area */}
              <div className={`p-4 ${darkMode ? 'bg-dark-subtle' : ''}`} style={{
                height: 'calc(70vh - 240px)',
                overflowY: 'auto',
                backgroundImage: darkMode ? 'none' : 'linear-gradient(45deg, rgba(59, 130, 246, 0.02) 25%, transparent 25%), linear-gradient(-45deg, rgba(59, 130, 246, 0.02) 25%, transparent 50%)',
                backgroundSize: '20px 20px'
              }}>
                {messages.map((message, index) => (
                  <div key={message.messageId || index} className={`d-flex mb-4 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    {message.sender === 'bot' && (
                      <div className="me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                          width: '50px',
                          height: '50px',
                          background: `linear-gradient(135deg, ${getMessageTypeColor(message.messageType)}, ${getMessageTypeColor(message.messageType)}80)`,
                          color: 'white',
                          fontSize: '1.3rem',
                          boxShadow: darkMode ? '0 4px 15px rgba(255,255,255,0.1)' : '0 4px 15px rgba(0,0,0,0.1)',
                          border: darkMode ? '1px solid rgba(255,255,255,0.2)' : 'none'
                        }}>
                          {getBotMessageIcon(message.messageType)}
                        </div>
                      </div>
                    )}
                    <div className={`message-bubble ${message.sender === 'user' ? 'user-message' : 'bot-message'}`} style={{
                      maxWidth: '75%',
                      padding: '1.25rem 1.75rem',
                      borderRadius: message.sender === 'user' ? '25px 25px 8px 25px' : '25px 25px 25px 8px',
                      background: message.sender === 'user'
                        ? (darkMode ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)' : 'linear-gradient(45deg, #007bff, #0056b3)')
                        : (darkMode ? '#374151' : 'white'),
                      color: message.sender === 'user' ? 'white' : (darkMode ? '#f9fafb' : '#333'),
                      boxShadow: darkMode ? '0 4-15px rgba(255,255,255,0.05)' : '0 4px 15px rgba(0,0,0,0.1)',
                      position: 'relative',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                    }}>
                      <div className="message-content" style={{ lineHeight: '1.6' }}>
                        {message.message}
                      </div>
                      <div className={`mt-2 small ${message.sender === 'user' ? (darkMode ? 'text-white-50' : 'text-white-50') : (darkMode ? 'text-gray-400' : 'text-muted')}`}>
                        {formatTimestamp(message.timestamp)}
                        {message.messageType && message.sender === 'bot' && (
                          <span className="ms-2 badge fw-semibold" style={{
                            backgroundColor: getMessageTypeColor(message.messageType) + (darkMode ? '80' : ''),
                            fontSize: '0.75rem',
                            color: darkMode ? '#fff' : '#fff'
                          }}>
                            {message.messageType.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="ms-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                          width: '50px',
                          height: '50px',
                          background: darkMode ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)' : 'linear-gradient(45deg, #007bff, #0056b3)',
                          color: 'white',
                          fontSize: '1.3rem',
                          boxShadow: darkMode ? '0 4px 15px rgba(255,255,255,0.1)' : '0 4px 15px rgba(0,123,255,0.2)',
                          border: darkMode ? '1px solid rgba(255,255,255,0.2)' : 'none'
                        }}>
                          👤
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="d-flex justify-content-start mb-4">
                    <div className="me-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                        width: '50px',
                        height: '50px',
                        background: darkMode ? 'linear-gradient(45deg, #6b7280, #4b5563)' : 'linear-gradient(45deg, #6c757d, #495057)',
                        color: 'white',
                        fontSize: '1.3rem',
                        boxShadow: darkMode ? '0 4px 15px rgba(255,255,255,0.05)' : '0 4px 15px rgba(0,0,0,0.1)'
                      }}>
                        🏗️
                      </div>
                    </div>
                    <div className={`typing-indicator rounded-3 px-4 py-3 ${darkMode ? 'bg-dark-subtle' : 'bg-light'}`} style={{
                      boxShadow: darkMode ? '0 4px 15px rgba(255,255,255,0.05)' : '0 4px 15px rgba(0,0,0,0.1)',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                    }}>
                      <div className="typing-dots d-flex align-items-center">
                        <span className="dot me-1"></span>
                        <span className="dot me-1"></span>
                        <span className="dot"></span>
                        <span className="ms-2 text-muted small">Projecto is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input Area - This was missing! */}
              <div className="p-4" style={{
                borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                background: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}>
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} rounded-pill`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{
                            fontSize: '0.875rem',
                            padding: '0.5rem 1rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Input Controls */}
                <div className="input-group" style={{ borderRadius: '25px', overflow: 'hidden' }}>
                  <button
                    className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ borderRadius: '25px 0 0 25px' }}
                    title="Upload file"
                  >
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <textarea
                    className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    placeholder="Ask Projecto about your construction project..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows="1"
                    style={{
                      resize: 'none',
                      minHeight: '50px',
                      border: 'none',
                      boxShadow: 'none',
                      background: darkMode ? '#374151' : '#f8f9fa'
                    }}
                    disabled={isTyping}
                  />
                  <button
                    className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                    type="button"
                    onClick={toggleVoice}
                    style={{
                      borderLeft: 'none',
                      color: isVoiceActive ? '#dc3545' : (darkMode ? '#f8f9fa' : '#6c757d')
                    }}
                    title={isVoiceActive ? 'Stop recording' : 'Voice input'}
                  >
                    <i className={`fas ${isVoiceActive ? 'fa-stop' : 'fa-microphone'} ${isVoiceActive ? 'text-danger' : ''}`}></i>
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    style={{
                      borderRadius: '0 25px 25px 0',
                      background: darkMode ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)' : 'linear-gradient(45deg, #007bff, #0056b3)',
                      border: 'none',
                      minWidth: '60px'
                    }}
                  >
                    {isTyping ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Sending...</span>
                      </div>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
              </div>
            </div>
            {/* Knowledge Panel */}
            {showKnowledgePanel && (
              <div className={`position-fixed top-0 end-0 h-100 ${darkMode ? 'bg-dark text-light' : 'bg-light'} shadow-lg`}
                style={{
                  width: '400px',
                  zIndex: 1050,
                  transform: showKnowledgePanel ? 'translateX(0)' : 'translateX(100%)',
                  transition: 'transform 0.3s ease',
                  borderLeft: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
                }}>
                <div className="p-4 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 fw-bold">
                      <i className="fas fa-book me-2"></i>Knowledge Base
                    </h5>
                    <button
                      className={`btn-close ${darkMode ? 'btn-close-white' : ''}`}
                      onClick={() => setShowKnowledgePanel(false)}
                    ></button>
                  </div>
                  <div className="flex-grow-1 overflow-auto">
                    <div className="row g-3">
                      {knowledgeCategories.map((category, index) => {
                        // Check for valid category object before rendering
                        if (!category || !category.name) {
                          return null; // Don't render if the object is invalid
                        }
                        return (
                          <div key={category.id || index} className="col-12">
                            <div
                              className={`card h-100 cursor-pointer ${darkMode ? 'bg-dark-subtle border-secondary' : 'bg-white'} hover-shadow`}
                              onClick={() => openKnowledgeCategory(category)}
                              style={{
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
                              }}
                            >
                              <div className="card-body p-3">
                                <div className="d-flex align-items-start">
                                  <div className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                      color: 'white'
                                    }}>
                                    <i className={category.icon || 'fas fa-folder'}></i>
                                  </div>
                                  <div className="flex-grow-1">
                                    <h6 className="mb-2 fw-bold">{category.name}</h6>
                                    <p className={`small mb-0 ${darkMode ? 'text-light-secondary' : 'text-muted'}`}>
                                      {category.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Quick Actions */}
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-lightning-bolt me-2"></i>Quick Actions
                      </h6>
                      <div className="d-grid gap-2">
                        <button
                          className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} text-start`}
                          onClick={() => sendMessage("Calculate project costs for a 2000 sq ft house")}
                        >
                          <i className="fas fa-calculator me-2"></i>Cost Calculator
                        </button>
                        <button
                          className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} text-start`}
                          onClick={() => sendMessage("Create a construction timeline template")}
                        >
                          <i className="fas fa-calendar me-2"></i>Timeline Planner
                        </button>
                        <button
                          className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} text-start`}
                          onClick={() => sendMessage("Safety checklist for construction site")}
                        >
                          <i className="fas fa-shield-alt me-2"></i>Safety Guide
                        </button>
                        <button
                          className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} text-start`}
                          onClick={() => sendMessage("Recommend sustainable building materials")}
                        >
                          <i className="fas fa-leaf me-2"></i>Green Materials
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Footer Info */}
            <div className="row mt-5 mb-4">
              <div className="col-12">
                <div className="card bg-light border-0">
                  <div className="card-body text-center py-3">
                    <small className="text-muted">
                      Powered by intelligent automation, this chatbot is designed to guide, support, and provide instant answers — <br />available anytime to make your experience faster, easier, and more reliable
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Animations and Styles */}
      <style>{`
        .typing-dots .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: ${darkMode ? '#d1d5db' : '#6b7280'};
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dots .dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        .message-bubble {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: ${darkMode ? '0 8px 25px rgba(255,255,255,0.1)' : '0 8px 25px rgba(0,0,0,0.15)'} !important;
        }
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(248,249,250,0.5)'};
        }
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4b5563' : '#d1d5db'};
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#6b7280' : '#9ca3af'};
        }
        /* Input focus effects */
        .form-control:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25) !important;
        }
        /* Button hover effects */
        .btn {
          transition: all 0.3s ease;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        /* Dark mode overrides */
        .dark-mode {
          --bs-dark: #1f2937;
          --bs-dark-rgb: 31,41,55;
        }
        .dark-mode .bg-dark-subtle {
          background-color: rgba(55, 65, 81, 0.5) !important;
        }
        .dark-mode .text-light-secondary {
          color: rgba(209, 213, 219, 0.7) !important;
        }
        /* Knowledge panel animation */
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        /* Voice recording animation */
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
          }
        }
        .text-danger {
          animation: pulse 2s infinite;
        }
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .display-3 {
            font-size: 2rem !important;
          }
          .card {
            height: 80vh !important;
          }
          .position-fixed {
            width: 100% !important;
          }
          .message-bubble {
            max-width: 85% !important;
          }
        }
        /* File upload indicator */
        .file-upload-active {
          border: 2px dashed #3b82f6 !important;
          background: rgba(59, 130, 246, 0.1) !important;
        }
        /* Message type indicators */
        .badge {
          font-size: 0.65rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
        }
        /* Enhanced shadows */
        .shadow-xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
        /* Smooth transitions for all elements */
        *, *::before, *::after {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        /* Custom button styles */
        .btn-outline-primary:hover {
          background-color: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }
        .btn-primary {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          border: none;
        }
        .btn-primary:hover {
          background: linear-gradient(45deg, #1d4ed8, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}