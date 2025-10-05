const mongoose = require('mongoose');

// Chat Conversation Schema
const chatConversationSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: 'guest'
  },
  messages: [{
    messageId: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageType: {
      type: String,
      enum: ['text', 'suggestion', 'data', 'calculation', 'guidance', 'clarification', 'knowledge', 'greeting', 'error'],
      default: 'text'
    },
    metadata: {
      category: String,
      context: String,
      relatedProject: String,
      confidence: Number
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  },
  tags: [String],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Construction Knowledge Base Schema
const knowledgeBaseSchema = new mongoose.Schema({
  knowledgeId: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Construction Basics',
      'Architecture Design',
      'Engineering Principles',
      'Project Management',
      'Materials & Resources',
      'Tools & Equipment',
      'Safety Guidelines',
      'Cost Estimation',
      'Timeline Planning',
      'Quality Control',
      'Building Codes',
      'Sustainability'
    ]
  },
  subcategory: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  keywords: [String],
  relatedTopics: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date
  }
}, {
  timestamps: true
});

// Pre-populated Construction Knowledge Base
const CONSTRUCTION_KNOWLEDGE = [
  // Construction Basics
  {
    knowledgeId: 'cb001',
    category: 'Construction Basics',
    subcategory: 'Foundation',
    question: 'What are the different types of foundations in construction?',
    answer: 'There are several types of foundations: 1) Shallow Foundations: Strip foundations, pad foundations, raft foundations. 2) Deep Foundations: Pile foundations, pier foundations, caisson foundations. The choice depends on soil conditions, building load, and site constraints.',
    keywords: ['foundation', 'types', 'shallow', 'deep', 'pile', 'raft', 'strip'],
    relatedTopics: ['soil analysis', 'structural design', 'excavation'],
    difficulty: 'beginner'
  },
  {
    knowledgeId: 'cb002',
    category: 'Construction Basics',
    subcategory: 'Concrete',
    question: 'What is the standard concrete mix ratio?',
    answer: 'Standard concrete mix ratios: M15 (1:2:4), M20 (1:1.5:3), M25 (1:1:2). The ratio represents Cement:Sand:Aggregate. M20 is commonly used for residential construction, M25 for commercial buildings. Always use proper water-cement ratio (0.4-0.6) for strength.',
    keywords: ['concrete', 'mix', 'ratio', 'cement', 'sand', 'aggregate', 'M20', 'M25'],
    relatedTopics: ['materials', 'strength', 'quality control'],
    difficulty: 'beginner'
  },
  
  // Architecture Design
  {
    knowledgeId: 'ad001',
    category: 'Architecture Design',
    subcategory: 'Space Planning',
    question: 'What are the principles of good space planning in architecture?',
    answer: 'Key principles include: 1) Functionality - spaces serve their intended purpose efficiently. 2) Flow - smooth circulation between spaces. 3) Proportion - balanced room sizes. 4) Natural light and ventilation. 5) Privacy levels. 6) Flexibility for future changes. 7) Accessibility compliance.',
    keywords: ['space planning', 'functionality', 'circulation', 'proportion', 'natural light'],
    relatedTopics: ['building codes', 'accessibility', 'interior design'],
    difficulty: 'intermediate'
  },
  
  // Engineering Principles
  {
    knowledgeId: 'ep001',
    category: 'Engineering Principles',
    subcategory: 'Structural Design',
    question: 'What factors affect structural design in buildings?',
    answer: 'Key factors: 1) Dead loads (permanent fixtures), 2) Live loads (occupancy, furniture), 3) Wind loads, 4) Seismic forces, 5) Material properties, 6) Soil conditions, 7) Building codes and safety factors, 8) Economic considerations, 9) Constructability.',
    keywords: ['structural design', 'loads', 'dead load', 'live load', 'wind', 'seismic', 'safety'],
    relatedTopics: ['foundation design', 'materials', 'building codes'],
    difficulty: 'advanced'
  },
  
  // Project Management
  {
    knowledgeId: 'pm001',
    category: 'Project Management',
    subcategory: 'Planning',
    question: 'What are the key phases of construction project management?',
    answer: 'Construction project phases: 1) Initiation & Feasibility, 2) Planning & Design, 3) Procurement, 4) Construction Execution, 5) Monitoring & Control, 6) Commissioning, 7) Handover & Closeout. Each phase has specific deliverables and milestones.',
    keywords: ['project management', 'phases', 'planning', 'execution', 'monitoring', 'closeout'],
    relatedTopics: ['timeline planning', 'cost estimation', 'quality control'],
    difficulty: 'intermediate'
  },
  
  // Materials & Resources
  {
    knowledgeId: 'mr001',
    category: 'Materials & Resources',
    subcategory: 'Steel',
    question: 'What are the different grades of steel used in construction?',
    answer: 'Common steel grades: 1) Mild Steel (Grade 250) - general construction, 2) Medium Carbon Steel (Grade 350) - structural elements, 3) High Tensile Steel (Grade 500) - reinforcement, 4) Stainless Steel - corrosion resistance, 5) Weathering Steel - outdoor structures.',
    keywords: ['steel', 'grades', 'mild steel', 'high tensile', 'reinforcement', 'structural'],
    relatedTopics: ['materials testing', 'structural design', 'corrosion protection'],
    difficulty: 'intermediate'
  },
  
  // Safety Guidelines
  {
    knowledgeId: 'sg001',
    category: 'Safety Guidelines',
    subcategory: 'PPE',
    question: 'What personal protective equipment is essential on construction sites?',
    answer: 'Essential PPE includes: 1) Hard hats (head protection), 2) Safety glasses/goggles (eye protection), 3) Steel-toe boots (foot protection), 4) High-visibility vests, 5) Work gloves, 6) Hearing protection, 7) Respiratory masks when needed, 8) Fall protection harnesses for height work.',
    keywords: ['PPE', 'safety', 'hard hat', 'safety glasses', 'steel toe boots', 'harness'],
    relatedTopics: ['safety regulations', 'risk assessment', 'accident prevention'],
    difficulty: 'beginner'
  },
  
  // Cost Estimation
  {
    knowledgeId: 'ce001',
    category: 'Cost Estimation',
    subcategory: 'Methods',
    question: 'What are the different methods of construction cost estimation?',
    answer: 'Cost estimation methods: 1) Square foot method ($/sq ft), 2) Assembly method (cost per building component), 3) Unit cost method (detailed quantity takeoff), 4) Parametric estimation (statistical relationships), 5) Analogous estimation (similar projects).',
    keywords: ['cost estimation', 'square foot', 'unit cost', 'quantity takeoff', 'parametric'],
    relatedTopics: ['budgeting', 'project planning', 'financial management'],
    difficulty: 'intermediate'
  }
];

// Helper function to generate unique conversation ID
const generateConversationId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `CHAT-${timestamp}-${randomStr}`.toUpperCase();
};

// Helper function to generate unique message ID
const generateMessageId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 3);
  return `MSG-${timestamp}-${randomStr}`.toUpperCase();
};

// Helper function to generate unique knowledge ID
const generateKnowledgeId = (category) => {
  const categoryCode = category.substring(0, 2).toLowerCase();
  const timestamp = Date.now().toString(36);
  return `${categoryCode}-${timestamp}`;
};

module.exports = {
  ChatConversation: mongoose.model('ChatConversation', chatConversationSchema),
  KnowledgeBase: mongoose.model('KnowledgeBase', knowledgeBaseSchema),
  CONSTRUCTION_KNOWLEDGE,
  generateConversationId,
  generateMessageId,
  generateKnowledgeId
};