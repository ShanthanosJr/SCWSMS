// routes/chatbot.js
const router = require('express').Router();
const chatbotController = require('../Controllers/ChatBotCtrl');

// Conversation Management Routes
router.get('/conversation/:conversationId', chatbotController.getOrCreateConversation);
router.post('/conversation/:conversationId/message', chatbotController.sendMessage);
router.get('/conversation/:conversationId/history', chatbotController.getConversationHistory);
router.get('/conversations', chatbotController.getUserConversations);

// Knowledge Base Routes
router.get('/knowledge/search', chatbotController.searchKnowledge);
router.get('/knowledge/categories', chatbotController.getKnowledgeCategories);

module.exports = router;