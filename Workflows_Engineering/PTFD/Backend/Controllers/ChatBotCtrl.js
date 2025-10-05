const { ChatConversation, KnowledgeBase, CONSTRUCTION_KNOWLEDGE, generateConversationId, generateMessageId } = require('../Model/ChatBotMdl');
const Project = require('../Model/ProjectModel');
const ProjectTimeline = require('../Model/ProjectTimelineMdl');
const { FinancialDashboard } = require('../Model/FinancialDashboardMdl');

// Initialize knowledge base with predefined data
const initializeKnowledgeBase = async () => {
  try {
    const existingCount = await KnowledgeBase.countDocuments();
    if (existingCount === 0) {
      console.log('🤖 Initializing ChatBot knowledge base...');
      await KnowledgeBase.insertMany(CONSTRUCTION_KNOWLEDGE);
      console.log(`✅ Loaded ${CONSTRUCTION_KNOWLEDGE.length} knowledge entries`);
    }
  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error);
  }
};

// Smart response generation based on user input
const generateSmartResponse = async (userMessage, conversationContext = {}) => {
  try {
    const message = userMessage.toLowerCase().trim();
    
    if (message.includes('project') || message.includes('timeline') || message.includes('financial')) {
      return await handleProjectQueries(message, conversationContext);
    }
    
    const knowledgeResponse = await searchKnowledgeBase(message);
    if (knowledgeResponse) {
      return knowledgeResponse;
    }
    
    if (isGreeting(message)) {
      return generateGreetingResponse();
    }
    
    if (message.includes('cost') || message.includes('price') || message.includes('estimate')) {
      return generateCostGuidance(message);
    }
    
    if (message.includes('material') || message.includes('tool') || message.includes('equipment')) {
      return generateResourceGuidance(message);
    }
    
    return generateDefaultResponse(message);
    
  } catch (error) {
    console.error('❌ Error generating smart response:', error);
    return {
      message: "I apologize, but I'm experiencing some technical difficulties. Please try asking your question again or contact support if the issue persists.",
      type: 'error',
      suggestions: ['Try rephrasing your question', 'Ask about construction basics', 'Inquire about project planning']
    };
  }
};

// Search knowledge base for relevant information
const searchKnowledgeBase = async (query) => {
  try {
    const keywords = extractKeywords(query);
    
    // Search by keywords and content
    const results = await KnowledgeBase.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { keywords: { $in: keywords } },
            { question: { $regex: query, $options: 'i' } },
            { answer: { $regex: query, $options: 'i' } },
            { subcategory: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).limit(3).sort({ usageCount: -1 });
    
    if (results.length > 0) {
      await KnowledgeBase.findByIdAndUpdate(results[0]._id, {
        $inc: { usageCount: 1 },
        lastUsed: new Date()
      });
      
      const primaryResult = results[0];
      return {
        message: primaryResult.answer,
        type: 'knowledge',
        category: primaryResult.category,
        metadata: {
          confidence: 0.9,
          source: 'knowledge_base',
          relatedTopics: primaryResult.relatedTopics
        },
        suggestions: generateRelatedSuggestions(primaryResult.relatedTopics, primaryResult.category)
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error searching knowledge base:', error);
    return null;
  }
};

// Handle project-specific queries
const handleProjectQueries = async (message, context) => {
  try {
    if (message.includes('how many projects') || message.includes('project count')) {
      const projectCount = await Project.countDocuments();
      return {
        message: `You currently have ${projectCount} projects in your system. Would you like me to provide details about any specific project or help you with project planning?`,
        type: 'data',
        suggestions: ['Show project details', 'Help with new project planning', 'Project cost estimation']
      };
    }
    
    if (message.includes('project cost') || message.includes('financial dashboard')) {
      const dashboards = await FinancialDashboard.find().limit(1).sort({ createdAt: -1 });
      if (dashboards.length > 0) {
        const latest = dashboards[0];
        return {
          message: `Your latest financial analysis shows a total project value of $${latest.financialSummary?.grandTotal?.toLocaleString() || '0'}. This includes labor costs, materials, tools, and other expenses. Would you like detailed breakdown or help optimizing costs?`,
          type: 'calculation',
          suggestions: ['Cost breakdown details', 'Cost optimization tips', 'Budget planning help']
        };
      }
    }
    
    if (message.includes('timeline') || message.includes('schedule')) {
      const timelineCount = await ProjectTimeline.countDocuments();
      return {
        message: `You have ${timelineCount} timeline entries in your system. I can help you optimize project schedules, identify potential delays, or suggest resource allocation improvements. What specific timeline assistance do you need?`,
        type: 'data',
        suggestions: ['Timeline optimization', 'Resource allocation', 'Delay prevention strategies']
      };
    }
    
    return {
      message: "I can help you with various project-related topics including planning, cost estimation, timeline management, and resource allocation. What specific aspect of your project would you like assistance with?",
      type: 'suggestion',
      suggestions: ['Project planning guidance', 'Cost estimation help', 'Timeline optimization', 'Resource management']
    };
    
  } catch (error) {
    console.error('❌ Error handling project queries:', error);
    return null;
  }
};

// Generate cost and estimation guidance
const generateCostGuidance = (message) => {
  if (message.includes('concrete')) {
    return {
      message: "Concrete costs vary by grade and location. Typical costs: M15 concrete: $80-100/cubic meter, M20: $90-110/cubic meter, M25: $100-120/cubic meter. Factors affecting cost: cement grade, aggregate quality, transportation, labor rates. Would you like specific calculations for your project?",
      type: 'calculation',
      suggestions: ['Calculate concrete quantity', 'Compare concrete grades', 'Labor cost estimation']
    };
  }
  
  if (message.includes('steel') || message.includes('rebar')) {
    return {
      message: "Steel reinforcement costs: Grade 250: $600-700/ton, Grade 500: $650-750/ton. Include 10-15% wastage in calculations. Steel prices fluctuate with market conditions. Consider bulk purchasing for large projects.",
      type: 'calculation',
      suggestions: ['Steel quantity calculation', 'Market price updates', 'Bulk purchase planning']
    };
  }
  
  return {
    message: "I can help with cost estimation for various construction elements including materials, labor, equipment, and overhead costs. Typical cost breakdown: Materials (40-50%), Labor (30-40%), Equipment (10-15%), Overhead (5-10%). What specific cost estimation do you need?",
    type: 'guidance',
    suggestions: ['Material cost estimation', 'Labor cost calculation', 'Equipment rental costs', 'Overhead planning']
  };
};

// Generate resource and material guidance
const generateResourceGuidance = (message) => {
  if (message.includes('foundation')) {
    return {
      message: "Foundation materials depend on soil conditions and building type. Common materials: Portland cement, aggregates (gravel, sand), steel reinforcement, waterproofing membrane, and concrete admixtures. For rocky soil: minimal excavation needed. For soft soil: consider pile foundations or soil stabilization.",
      type: 'guidance',
      suggestions: ['Soil testing guidance', 'Foundation type selection', 'Waterproofing solutions']
    };
  }
  
  if (message.includes('roofing')) {
    return {
      message: "Roofing material selection depends on climate, budget, and building design. Options: Concrete tiles (durable, 50+ years), Metal roofing (lightweight, 30-50 years), Asphalt shingles (economical, 20-30 years), Clay tiles (aesthetic, 50+ years). Consider local weather patterns and building codes.",
      type: 'guidance',
      suggestions: ['Climate-appropriate roofing', 'Cost comparison', 'Installation guidelines']
    };
  }
  
  return {
    message: "I can provide guidance on various construction materials and tools including selection criteria, quality standards, cost optimization, and supplier recommendations. What specific materials or equipment information do you need?",
    type: 'guidance',
    suggestions: ['Material selection guide', 'Quality standards', 'Tool recommendations', 'Supplier evaluation']
  };
};

const isGreeting = (message) => {
  const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
  return greetings.some(greeting => message.includes(greeting));
};

// Generate greeting response
const generateGreetingResponse = () => {
  const greetings = [
    "Hello! I'm your Construction AI Assistant. I'm here to help with construction, architecture, engineering, and project management questions.",
    "Hi there! I can assist you with project planning, cost estimation, material selection, and construction best practices.",
    "Greetings! I'm ready to help with your construction and engineering queries. What would you like to know?"
  ];
  
  return {
    message: greetings[Math.floor(Math.random() * greetings.length)],
    type: 'greeting',
    suggestions: [
      'Ask about construction materials',
      'Get project planning advice',
      'Calculate construction costs',
      'Learn about building codes'
    ]
  };
};

// Generate default helpful response
const generateDefaultResponse = (message) => {
  return {
    message: "I'm here to help with construction, architecture, engineering, and project management questions. I can assist with material selection, cost estimation, project planning, safety guidelines, and technical specifications. Could you please rephrase your question or be more specific about what you'd like to know?",
    type: 'clarification',
    suggestions: [
      'Ask about construction materials',
      'Get cost estimation help',
      'Learn about project planning',
      'Safety guidelines and best practices'
    ]
  };
};

// Extract keywords from user query
const extractKeywords = (query) => {
  const commonWords = ['the', 'is', 'are', 'what', 'how', 'where', 'when', 'why', 'can', 'could', 'would', 'should', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  return query.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .slice(0, 5); // Limit to 5 keywords
};

// Generate related suggestions
const generateRelatedSuggestions = (relatedTopics, category) => {
  const suggestions = relatedTopics.slice(0, 3);
  suggestions.push(`More about ${category.toLowerCase()}`);
  return suggestions;
};

// Get or create conversation
const getOrCreateConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    let conversation;
    if (conversationId && conversationId !== 'new') {
      conversation = await ChatConversation.findOne({ conversationId });
    }
    
    if (!conversation) {
      conversation = new ChatConversation({
        conversationId: generateConversationId(),
        messages: []
      });
      await conversation.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Conversation retrieved successfully',
      data: conversation
    });
  } catch (error) {
    console.error('❌ Error getting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving conversation',
      error: error.message
    });
  }
};

// Send message and get AI response
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message, userId = 'guest' } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }
    
    // Find or create conversation
    let conversation = await ChatConversation.findOne({ conversationId });
    if (!conversation) {
      conversation = new ChatConversation({
        conversationId,
        userId,
        messages: []
      });
    }
    
    // Add user message
    const userMessageId = generateMessageId();
    const userMessageObj = {
      messageId: userMessageId,
      sender: 'user',
      message: message.trim(),
      timestamp: new Date(),
      messageType: 'text'
    };
    
    conversation.messages.push(userMessageObj);
    
    // Generate AI response
    const aiResponse = await generateSmartResponse(message, {
      conversationId,
      userId,
      previousMessages: conversation.messages
    });
    
    // Add bot response
    const botMessageId = generateMessageId();
    const botMessageObj = {
      messageId: botMessageId,
      sender: 'bot',
      message: aiResponse.message,
      timestamp: new Date(),
      messageType: aiResponse.type || 'text',
      metadata: {
        category: aiResponse.category,
        context: aiResponse.type,
        confidence: aiResponse.metadata?.confidence || 0.8
      }
    };
    
    conversation.messages.push(botMessageObj);
    conversation.lastActivity = new Date();
    
    await conversation.save();
    
    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        conversation,
        response: {
          ...aiResponse,
          messageId: botMessageId,
          timestamp: botMessageObj.timestamp
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing message',
      error: error.message
    });
  }
};

// Get conversation history
const getConversationHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const conversation = await ChatConversation.findOne({ conversationId });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Conversation history retrieved successfully',
      data: conversation
    });
  } catch (error) {
    console.error('❌ Error getting conversation history:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving conversation history',
      error: error.message
    });
  }
};

// Get all conversations 
const getUserConversations = async (req, res) => {
  try {
    const { userId = 'guest' } = req.query;
    
    const conversations = await ChatConversation.find({ userId })
      .sort({ lastActivity: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      message: `Found ${conversations.length} conversations`,
      data: conversations
    });
  } catch (error) {
    console.error('❌ Error getting user conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving conversations',
      error: error.message
    });
  }
};

// Search knowledge base
const searchKnowledge = async (req, res) => {
  try {
    const { query, category, difficulty } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const searchCriteria = {
      isActive: true,
      $or: [
        { question: { $regex: query, $options: 'i' } },
        { answer: { $regex: query, $options: 'i' } },
        { keywords: { $in: [new RegExp(query, 'i')] } }
      ]
    };
    
    if (category) {
      searchCriteria.category = category;
    }
    
    if (difficulty) {
      searchCriteria.difficulty = difficulty;
    }
    
    const results = await KnowledgeBase.find(searchCriteria)
      .sort({ usageCount: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      message: `Found ${results.length} knowledge entries`,
      data: results
    });
  } catch (error) {
    console.error('❌ Error searching knowledge base:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching knowledge base',
      error: error.message
    });
  }
};

// Get knowledge categories
const getKnowledgeCategories = async (req, res) => {
  try {
    const categories = await KnowledgeBase.distinct('category', { isActive: true });
    
    res.status(200).json({
      success: true,
      message: 'Knowledge categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('❌ Error getting knowledge categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving knowledge categories',
      error: error.message
    });
  }
};

module.exports = {
  initializeKnowledgeBase,
  getOrCreateConversation,
  sendMessage,
  getConversationHistory,
  getUserConversations,
  searchKnowledge,
  getKnowledgeCategories
};