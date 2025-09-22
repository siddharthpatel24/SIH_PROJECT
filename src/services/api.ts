// Real AI Integration with Hugging Face and OpenAI
// Falls back to mock functions if API calls fail

const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Hugging Face Sentiment Analysis
const analyzeWithHuggingFace = async (text: string) => {
  if (!HF_API_KEY) {
    throw new Error('Hugging Face API key not configured');
  }

  const response = await fetch(
    'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
    {
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const result = await response.json();
  
  // Handle the response format from Hugging Face
  if (Array.isArray(result) && result.length > 0) {
    const predictions = result[0];
    const positive = predictions.find((p: any) => p.label === 'POSITIVE');
    const negative = predictions.find((p: any) => p.label === 'NEGATIVE');
    
    if (positive && negative) {
      const sentiment = positive.score > negative.score ? 'Positive' : 'Negative';
      const confidence = Math.round(Math.max(positive.score, negative.score) * 100);
      return { sentiment, confidence };
    }
  }
  
  throw new Error('Unexpected response format from Hugging Face');
};

// OpenAI Summarization
const summarizeWithOpenAI = async (feedbackTexts: string[]) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const combinedText = feedbackTexts.join('\n\n');
  const prompt = `Please analyze and summarize the following citizen feedback on a government policy. Provide insights about the overall sentiment, main concerns, and key themes:

${combinedText}

Summary:`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes citizen feedback on government policies. Provide concise, balanced summaries highlighting key themes and sentiment.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const result = await response.json();
  return result.choices[0]?.message?.content || 'Unable to generate summary';
};

// Mock AI functions (fallback)
const mockSentimentAnalysis = async (text: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const positiveKeywords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'appreciate', 'support', 'helpful', 'beneficial', 'positive', 'approve'];
  const negativeKeywords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'disappointed', 'frustrated', 'angry', 'poor', 'worst', 'against', 'oppose', 'concern', 'problem'];
  
  const lowerText = text.toLowerCase();
  
  const positiveScore = positiveKeywords.reduce((score, word) => {
    return score + (lowerText.split(word).length - 1);
  }, 0);
  
  const negativeScore = negativeKeywords.reduce((score, word) => {
    return score + (lowerText.split(word).length - 1);
  }, 0);
  
  let sentiment;
  if (positiveScore > negativeScore) {
    sentiment = 'Positive';
  } else if (negativeScore > positiveScore) {
    sentiment = 'Negative';
  } else {
    sentiment = 'Neutral';
  }
  
  const confidence = Math.floor(Math.random() * 25) + 75; // 75-99%
  
  return { sentiment, confidence };
};

const mockSummarization = async (feedbackTexts: string[]) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const totalFeedback = feedbackTexts.length;
  const averageLength = Math.round(feedbackTexts.join(' ').length / totalFeedback);
  
  const templates = [
    `Based on ${totalFeedback} citizen responses, there is strong public engagement with this policy. Citizens have provided detailed feedback averaging ${averageLength} characters per response. Key themes include implementation concerns, resource allocation, and community impact. The feedback shows a mix of support and constructive criticism, indicating active civic participation.`,
    
    `Analysis of ${totalFeedback} public comments reveals diverse perspectives on this policy initiative. Citizens have expressed both appreciation for the government's efforts and concerns about practical implementation. Common topics include budget considerations, timeline feasibility, and potential benefits for different community segments.`,
    
    `Public consultation shows ${totalFeedback} citizens actively participating in the policy discussion. The feedback demonstrates informed civic engagement with substantive comments about policy implications. Citizens have highlighted both opportunities and challenges, providing valuable insights for policy refinement and implementation planning.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};

// Main exported functions with fallback logic
export const analyzeSentiment = async (text: string) => {
  try {
    console.log('Attempting Hugging Face sentiment analysis...');
    return await analyzeWithHuggingFace(text);
  } catch (error) {
    console.warn('Hugging Face API failed, using mock analysis:', error);
    return await mockSentimentAnalysis(text);
  }
};

export const summarizeFeedback = async (feedbackTexts: string[]) => {
  try {
    console.log('Attempting OpenAI summarization...');
    return await summarizeWithOpenAI(feedbackTexts);
  } catch (error) {
    console.warn('OpenAI API failed, using mock summarization:', error);
    return await mockSummarization(feedbackTexts);
  }
};

// Legacy functions for backward compatibility
export const generateSummary = async (text: string) => {
  return await summarizeFeedback([text]);
};

export const generateCollectiveSummary = async (allCommentsText: string, totalComments: number) => {
  const feedbackArray = allCommentsText.split('\n\n').filter(text => text.trim().length > 0);
  return await summarizeFeedback(feedbackArray);
};

export const analyzeCollectiveSentiment = (comments: any[]) => {
  const distribution = { positive: 0, negative: 0, neutral: 0 };
  
  comments.forEach(comment => {
    const sentiment = comment.sentiment.toLowerCase();
    if (sentiment === 'positive') distribution.positive++;
    else if (sentiment === 'negative') distribution.negative++;
    else distribution.neutral++;
  });
  
  return distribution;
};