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

// Generate collective summary from all comments on a policy
export const generateCollectiveSummary = async (allCommentsText: string, totalComments: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const positiveKeywords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'appreciate', 'support', 'helpful', 'beneficial', 'positive', 'approve'];
  const negativeKeywords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'disappointed', 'frustrated', 'angry', 'poor', 'worst', 'against', 'oppose', 'concern', 'problem'];
  const neutralKeywords = ['think', 'consider', 'suggest', 'maybe', 'perhaps', 'could', 'might', 'opinion', 'view', 'perspective'];
  
  const lowerText = allCommentsText.toLowerCase();
  
  const positiveCount = positiveKeywords.reduce((count, word) => count + (lowerText.split(word).length - 1), 0);
  const negativeCount = negativeKeywords.reduce((count, word) => count + (lowerText.split(word).length - 1), 0);
  const neutralCount = neutralKeywords.reduce((count, word) => count + (lowerText.split(word).length - 1), 0);
  
  let overallSentiment = 'Mixed';
  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    overallSentiment = 'Positive';
  } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
    overallSentiment = 'Negative';
  } else if (neutralCount > positiveCount && neutralCount > negativeCount) {
    overallSentiment = 'Neutral';
  }
  
  const summaryTemplates = {
    'Positive': [
      `Based on ${totalComments} citizen responses, there is strong public support for this policy. Citizens appreciate the initiative and believe it will bring positive changes to society. Key themes include community benefits, improved services, and long-term positive impact.`,
      `Analysis of ${totalComments} public comments reveals overwhelming approval for this policy. Citizens express confidence in the proposed measures and highlight potential benefits for economic growth and social welfare.`,
      `Public consultation shows ${totalComments} citizens are largely supportive of this policy direction. Feedback emphasizes the policy's alignment with public needs and expectations for better governance.`
    ],
    'Negative': [
      `Analysis of ${totalComments} citizen comments indicates significant concerns about this policy. Citizens have raised issues regarding implementation challenges, potential negative impacts, and resource allocation concerns.`,
      `Based on ${totalComments} public responses, there is considerable opposition to this policy. Citizens express worries about effectiveness, fairness, and potential unintended consequences.`,
      `Public feedback from ${totalComments} citizens shows resistance to this policy proposal. Key concerns include implementation feasibility, cost implications, and impact on different community segments.`
    ],
    'Neutral': [
      `Analysis of ${totalComments} citizen responses shows a balanced perspective on this policy. Citizens acknowledge both potential benefits and challenges, suggesting the need for careful implementation and monitoring.`,
      `Based on ${totalComments} public comments, citizens have mixed views on this policy. While some aspects are welcomed, others require further clarification and refinement.`,
      `Public consultation reveals ${totalComments} citizens have diverse opinions on this policy. Feedback suggests the need for additional public engagement and policy adjustments.`
    ],
    'Mixed': [
      `Comprehensive analysis of ${totalComments} citizen comments reveals diverse public opinion on this policy. Citizens have expressed both support and concerns, indicating the need for balanced implementation and ongoing dialogue.`,
      `Based on ${totalComments} public responses, this policy generates varied reactions from citizens. The feedback highlights both opportunities and challenges that require careful consideration.`,
      `Public consultation shows ${totalComments} citizens have complex views on this policy, with valid points raised on multiple aspects requiring government attention and possible policy refinements.`
    ]
  };
  
  const templates = summaryTemplates[overallSentiment] || summaryTemplates['Mixed'];
  return templates[Math.floor(Math.random() * templates.length)];
};

// Analyze collective sentiment distribution
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