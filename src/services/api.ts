// AI Analysis service - replace with real AI APIs later

// Mock AI functions
export const analyzeSentiment = async (text: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const sentiments = ['Positive', 'Negative', 'Neutral'];
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

export const generateSummary = async (text: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const templates = [
    'Citizen expresses concerns about',
    'Citizen shows support for',
    'Citizen provides feedback on',
    'Citizen discusses issues with',
    'Citizen highlights the importance of',
    'Citizen suggests improvements to',
    'Citizen raises questions about',
    'Citizen appreciates efforts in',
    'Citizen criticizes aspects of',
    'Citizen offers suggestions for'
  ];
  
  const topics = [
    'the proposed policy and its potential impact',
    'implementation strategies and timelines',
    'resource allocation and budget considerations',
    'public welfare and community benefits',
    'environmental implications and sustainability',
    'economic effects and financial planning',
    'social justice and equality aspects',
    'technological integration and digital transformation'
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  return `${template} ${topic}, providing detailed insights based on personal experience and community perspective.`;
};