import express from 'express'
import { dashSummarize, fetchAndAnalyzeComments, handleChatbotQuery, summarizeVideo } from '../controllers/dashController.js';

const dashRouter = express.Router();

dashRouter.post("/dash-summarize",dashSummarize)
dashRouter.post("/dash-summarize-video",summarizeVideo)
dashRouter.post("/dash-handle-chatbotquery",handleChatbotQuery)
dashRouter.post('/dash-analyze-comments', fetchAndAnalyzeComments);

export default dashRouter;