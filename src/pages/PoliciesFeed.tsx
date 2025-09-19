import React, { useState, useEffect } from 'react';
import { FileText, MessageSquare, Send, Calendar, RefreshCw, ChevronDown, ChevronUp, Users, TrendingUp } from 'lucide-react';
import { getPolicies, addComment, getComments } from '../services/firebase';
import { analyzeSentiment, generateSummary } from '../services/api';

interface Policy {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface Comment {
  id: string;
  text: string;
  sentiment: string;
  summary: string;
  confidence: number;
  timestamp: string;
}

const PoliciesFeed = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [expandedPolicies, setExpandedPolicies] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPoliciesAndComments();
  }, []);

  const fetchPoliciesAndComments = async () => {
    try {
      setLoading(true);
      const policiesData = await getPolicies();
      setPolicies(policiesData);

      // Fetch comments for each policy
      const commentsData: Record<string, Comment[]> = {};
      for (const policy of policiesData) {
        const policyComments = await getComments(policy.id);
        commentsData[policy.id] = policyComments;
      }
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (policyId: string) => {
    const commentText = newComments[policyId]?.trim();
    if (!commentText) return;

    setSubmitting(prev => ({ ...prev, [policyId]: true }));

    try {
      // Analyze sentiment
      const { sentiment, confidence } = await analyzeSentiment(commentText);
      const summary = await generateSummary(commentText);

      // Add comment to Firebase
      const newComment = await addComment(policyId, {
        text: commentText,
        sentiment,
        summary,
        confidence,
        timestamp: new Date().toISOString()
      });

      // Update local state
      setComments(prev => ({
        ...prev,
        [policyId]: [newComment, ...(prev[policyId] || [])]
      }));

      // Clear input
      setNewComments(prev => ({ ...prev, [policyId]: '' }));
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(prev => ({ ...prev, [policyId]: false }));
    }
  };

  const togglePolicyExpansion = (policyId: string) => {
    setExpandedPolicies(prev => ({
      ...prev,
      [policyId]: !prev[policyId]
    }));
  };

  const toggleCommentsView = (policyId: string) => {
    setShowComments(prev => ({
      ...prev,
      [policyId]: !prev[policyId]
    }));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Policy <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Consultation</span>
          </h1>
          <p className="text-lg text-gray-600">
            Browse government policies and share your feedback
          </p>
        </div>
        <button
          onClick={fetchPoliciesAndComments}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Policies Feed */}
      {policies.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Policies Yet</h3>
          <p className="text-gray-500">Government officials haven't posted any policies for consultation yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Policy Header */}
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h2 className="text-2xl font-bold text-gray-800 mb-3 flex-1">{policy.title}</h2>
                      <button
                        onClick={() => togglePolicyExpansion(policy.id)}
                        className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        {expandedPolicies[policy.id] ? 
                          <ChevronUp className="h-5 w-5 text-gray-600" /> : 
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        }
                      </button>
                    </div>
                    
                    {/* Policy Stats */}
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{comments[policy.id]?.length || 0} responses</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(policy.createdAt).toLocaleDateString()}</span>
                      </div>
                      {policy.sentimentDistribution && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          <span>
                            {policy.sentimentDistribution.positive > policy.sentimentDistribution.negative ? 
                              'Mostly Positive' : 
                              policy.sentimentDistribution.negative > policy.sentimentDistribution.positive ? 
                              'Mostly Negative' : 'Mixed Response'
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Collapsible Description */}
                    <div className={`transition-all duration-300 overflow-hidden ${
                      expandedPolicies[policy.id] ? 'max-h-none' : 'max-h-20'
                    }`}>
                      <p className="text-gray-600 leading-relaxed mb-4">{policy.description}</p>
                    </div>
                    
                    {!expandedPolicies[policy.id] && policy.description.length > 200 && (
                      <button
                        onClick={() => togglePolicyExpansion(policy.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Read more...
                      </button>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {policy.createdBy && (
                        <>
                          <span>Published by {policy.createdBy}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* AI Summary Section */}
                {policy.aiSummary && (
                  <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg mr-3">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                      Public Opinion Analysis ({policy.totalComments || 0} responses)
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3 text-sm">{policy.aiSummary}</p>
                    
                    {/* Sentiment Distribution */}
                    {policy.sentimentDistribution && (
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Positive: {policy.sentimentDistribution.positive}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Negative: {policy.sentimentDistribution.negative}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>Neutral: {policy.sentimentDistribution.neutral}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="p-6">
                {/* Comments Header with Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Public Feedback ({comments[policy.id]?.length || 0})
                  </h3>
                  <button
                    onClick={() => toggleCommentsView(policy.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    <span>{showComments[policy.id] ? 'Hide Comments' : 'View Comments'}</span>
                    {showComments[policy.id] ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </button>
                </div>

                {/* Comment Input */}
                <div className="mb-6">
                  <div className="flex space-x-4">
                    <textarea
                      value={newComments[policy.id] || ''}
                      onChange={(e) => setNewComments(prev => ({ ...prev, [policy.id]: e.target.value }))}
                      placeholder="Share your thoughts on this policy..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white/70"
                      rows={2}
                      disabled={submitting[policy.id]}
                    />
                    <button
                      onClick={() => handleCommentSubmit(policy.id)}
                      disabled={!newComments[policy.id]?.trim() || submitting[policy.id]}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                    >
                      {submitting[policy.id] ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                      <span className="hidden sm:inline">Submit</span>
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                {showComments[policy.id] && (
                  <div className="space-y-4 max-h-96 overflow-y-auto border-t border-gray-200 pt-4">
                    {comments[policy.id]?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No feedback yet. Be the first to comment!</p>
                      </div>
                    ) : (
                      comments[policy.id]?.map((comment) => (
                        <div key={comment.id} className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-4 border border-gray-200/50">
                          <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-3 lg:space-y-0">
                            <div className="flex-1">
                              <p className="text-gray-800 leading-relaxed mb-3 text-sm">{comment.text}</p>
                              
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(comment.timestamp).toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Sentiment Analysis */}
                            <div className="lg:w-32 text-center space-y-2">
                              <div className="text-2xl">{getSentimentIcon(comment.sentiment)}</div>
                              <span className={`inline-block px-2 py-1 rounded border font-semibold text-xs ${getSentimentColor(comment.sentiment)}`}>
                                {comment.sentiment}
                              </span>
                              <div>
                                <div className="text-xs font-semibold text-gray-700 mb-1">{comment.confidence}%</div>
                                <div className="bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full transition-all duration-500"
                                    style={{ width: `${comment.confidence}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoliciesFeed;