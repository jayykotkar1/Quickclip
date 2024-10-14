// Import required modules
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize GoogleGenerativeAI instance with your API key
const genAI = new GoogleGenerativeAI("AIzaSyDuC7b3V4V-BhFC9083BRP53GNhAllGlYQ");

// Function to fetch video details from YouTube Data API
const fetchVideoData = async (videoId) => {
    const apiKey = "AIzaSyCXWmAapdjRYTxnmiwVUUAAgjkNHVzVy5U"; // Replace with your YouTube Data API key
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

    try {
        const response = await axios.get(url);
        const videoData = response.data.items[0].snippet; // Extract video snippet
        return {
            title: videoData.title,
            description: videoData.description,
        };
    } catch (error) {
        throw new Error("Error fetching video data: " + error.message);
    }
};

// Controller function to handle the YouTube summary request
const dashSummarize = async (req, res) => {
    const { videoUrl } = req.body; // Extract video URL from the request body

    // Check if video URL is provided
    if (!videoUrl) {
        return res.status(400).json({ success: false, error: 'Video URL is required.' });
    }

    // Extract video ID from the URL
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
        return res.status(400).json({ success: false, error: 'Invalid video URL.' });
    }

    try {
        // Step 1: Fetch video data
        const { title, description } = await fetchVideoData(videoId);

        // Step 2: Generate summary using the Gemini model
        const prompt = `From now you are a Youtube video summarizer, Please give proper explanation the following YouTube video: Title: ${title}. Description: ${description}, Give Direct response with proper indentation`;

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Generate content using the model
        const result = await model.generateContent(prompt);

        // Safely extract the response text
        const summary = await result.response.text(); // Adjust this if necessary to access the summary

        // Step 3: Return the summary
        res.status(200).json({
            success: true,
            summary: summary.trim()
        });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ success: false, error: 'Failed to generate summary' });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Controller to fetch and summarize video
const summarizeVideo = async (req, res) => {
    const { videoUrl } = req.body; // Extract video URL from the request body

    // Check if video URL is provided
    if (!videoUrl) {
        return res.status(400).json({ success: false, error: 'Video URL is required.' });
    }

    // Extract video ID from the URL
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
        return res.status(400).json({ success: false, error: 'Invalid video URL.' });
    }

    try {
        // Step 1: Fetch video data
        const { title, description } = await fetchVideoData(videoId);

        // Step 2: Generate summary using the Gemini model
        const prompt = `From now you are a Youtube video summarizer. Please give a proper explanation of the following YouTube video: Title: ${title}. Description: ${description}. Give a direct response with proper indentation.`;

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Generate content using the model
        const result = await model.generateContent(prompt);

        // Safely extract the response text
        const summary = await result.response.text();

        // Step 3: Return the summary
        res.status(200).json({
            success: true,
            summary: summary.trim(),
            title: title
        });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ success: false, error: 'Failed to generate summary' });
    }
};

// Controller for handling chatbot queries
const handleChatbotQuery = async (req, res) => {
    const { userQuery, videoTitle, videoSummary } = req.body; // Extract user query, video title, and summary from the request body

    // Check if all required data is provided
    if (!userQuery || !videoTitle || !videoSummary) {
        return res.status(400).json({ success: false, error: 'User query, video title, and video summary are required.' });
    }

    try {
        // Construct the prompt for the chatbot
        const prompt = `You are a chatbot trained on the following YouTube video. Title: ${videoTitle}. Summary: ${videoSummary}. Respond to the user's query: ${userQuery}`;

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Generate response using the model
        const result = await model.generateContent(prompt);

        // Safely extract the response text
        const response = await result.response.text();

        // Step 3: Return the chatbot response
        res.status(200).json({
            success: true,
            response: response.trim()
        });
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        res.status(500).json({ success: false, error: 'Failed to generate chatbot response' });
    }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// Controller function to fetch comments from YouTube and analyze sentiment using the Gemini API
const fetchAndAnalyzeComments = async (req, res) => {
    const { videoUrl } = req.body; // Get the video URL from request body

    // Validate the video URL and extract the video ID
    const videoId = getVideoIdFromUrl(videoUrl);
    if (!videoId) {
        return res.status(400).json({ success: false, message: "Invalid YouTube URL." });
    }

    try {
        // Fetch YouTube comments using YouTube Data API
        const comments = await fetchYouTubeComments(videoId);

        // Check if any comments were retrieved
        if (comments.length === 0) {
            return res.status(200).json({ success: true, message: "No comments found." });
        }

        // Analyze comments using the Gemini API for sentiment analysis
        const sentimentResults = await analyzeCommentsWithGemini(comments);

        // Calculate percentage of each sentiment category
        const totalComments = sentimentResults.length;
        const sentimentCounts = sentimentResults.reduce((acc, result) => {
            acc[result.sentiment] = (acc[result.sentiment] || 0) + 1;
            return acc;
        }, {});

        const sentimentPercentages = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
            sentiment,
            percentage: ((count / totalComments) * 100).toFixed(2),
        }));

        // Return the sentiment percentages
        return res.status(200).json({
            success: true,
            totalComments,
            sentimentPercentages,
        });

    } catch (error) {
        console.error("Error fetching or analyzing comments:", error);
        return res.status(500).json({ success: false, message: "Error processing the request." });
    }
};

// Function to extract video ID from YouTube URL
const getVideoIdFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get("v");
    } catch (error) {
        console.error("Error parsing URL:", error);
        return null;
    }
};

// Function to fetch comments from YouTube using the YouTube Data API
const fetchYouTubeComments = async (videoId) => {
    const apiKey = "AIzaSyCXWmAapdjRYTxnmiwVUUAAgjkNHVzVy5U"; // YouTube API key from environment variable
    const comments = [];
    let nextPageToken = "";

    try {
        // Loop to fetch all pages of comments
        do {
            const { data } = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
                params: {
                    part: 'snippet',
                    videoId,
                    pageToken: nextPageToken,
                    maxResults: 100, // Fetch 100 comments at a time
                    key: apiKey
                }
            });

            // Extract comments from response
            const fetchedComments = data.items.map(item => item.snippet.topLevelComment.snippet.textDisplay);
            comments.push(...fetchedComments);
            nextPageToken = data.nextPageToken;
        } while (nextPageToken);

        return comments;
    } catch (error) {
        console.error("Error fetching YouTube comments:", error);
        throw new Error("Failed to fetch YouTube comments.");
    }
};

// Function to send comments to the Gemini model for sentiment analysis
const analyzeCommentsWithGemini = async (comments) => {
    const apiKey = "AIzaSyCciJzDBszuJg0-RYMDNo2u2efJwABfkBs"; // Gemini API key from environment variable
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Get the Gemini model

    const sentimentResults = [];

    for (const comment of comments) {
        const prompt = `Analyze the sentiment of the youtube comments and classify it as one of the following categories: Joyful, Sad, or Neutral.\nYoutube Comments: "${comment}"\nSentiment:`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const sentiment = response.text().trim(); // Get the sentiment output
            sentimentResults.push({ comment, sentiment }); // Store sentiment result
        } catch (error) {
            console.error("Error analyzing comment:", error);
            sentimentResults.push({ comment, sentiment: 'Unknown' }); // Fallback for errors
        }
    }

    return sentimentResults;
};





// Explicitly export the function
export { dashSummarize, summarizeVideo, handleChatbotQuery, fetchAndAnalyzeComments };
