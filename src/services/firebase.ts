import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  updateDoc,
  orderBy, 
  query,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Firebase configuration - replace with your actual project details
const firebaseConfig = {
  apiKey: "AIzaSyDhA1yw1pukUV_zyyl77nMutWLYPk7PxWg",
  authDomain: "sih-project-2004.firebaseapp.com",
  projectId: "sih-project-2004",
  storageBucket: "sih-project-2004.firebasestorage.app",
  messagingSenderId: "559516560940",
  appId: "1:559516560940:web:c0f3ef1413bc911f49eb89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

// Mock data for development when Firebase is not configured
let mockPolicies: any[] = [
  {
    id: '1',
    title: 'Digital India Initiative - Phase 2',
    description: 'Expanding digital infrastructure across rural areas to ensure every citizen has access to high-speed internet and digital services. This initiative aims to bridge the digital divide and promote inclusive growth through technology adoption.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Sustainable Transportation Policy',
    description: 'Promoting electric vehicles and public transportation to reduce carbon emissions. The policy includes subsidies for EV purchases, charging infrastructure development, and improved public transit systems in major cities.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let mockComments: Record<string, any[]> = {
  '1': [
    {
      id: 'c1',
      text: 'This is an excellent initiative that will help bridge the digital divide in rural areas. I fully support this policy.',
      sentiment: 'Positive',
      summary: 'User expresses strong support for the digital infrastructure expansion in rural areas.',
      confidence: 92,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  '2': [
    {
      id: 'c2',
      text: 'While I appreciate the environmental goals, the subsidies might not be enough to make EVs affordable for middle-class families.',
      sentiment: 'Neutral',
      summary: 'User supports environmental goals but raises concerns about EV affordability for middle-class families.',
      confidence: 78,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

// Helper function to check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return true; // Firebase is now properly configured
};

// Authentication functions
export const loginAsGovernment = async (email: string, password: string) => {
  try {
    // Check if email is from government domain
    if (!email.endsWith('@gov.in') && !email.endsWith('@government.in')) {
      throw new Error('Only government officials with @gov.in or @government.in email addresses can access this feature.');
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logoutGovernment = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Policy functions
export const addPolicy = async (title: string, description: string) => {
  try {
    const user = getCurrentUser();
    if (!user || (!user.email?.endsWith('@gov.in') && !user.email?.endsWith('@government.in'))) {
      throw new Error('Only government officials can add policies.');
    }
    
    if (isFirebaseConfigured()) {
      const docRef = await addDoc(collection(db, 'policies'), {
        title,
        description,
        createdAt: serverTimestamp(),
        createdBy: user.email,
        totalComments: 0,
        aiSummary: '',
        sentimentDistribution: { positive: 0, negative: 0, neutral: 0 }
      });
      return { id: docRef.id, title, description, createdAt: new Date().toISOString() };
    } else {
      // Use mock data
      const newPolicy = {
        id: Date.now().toString(),
        title,
        description,
        createdAt: new Date().toISOString()
      };
      mockPolicies.unshift(newPolicy);
      return newPolicy;
    }
  } catch (error) {
    console.error('Error adding policy:', error);
    throw error;
  }
};

export const getPolicies = async () => {
  try {
    if (isFirebaseConfigured()) {
      const q = query(collection(db, 'policies'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
        };
      });
    } else {
      // Return mock data
      return [...mockPolicies];
    }
  } catch (error) {
    console.error('Error getting policies:', error);
    throw error;
  }
};

// Comment functions
export const addComment = async (policyId: string, comment: any) => {
  try {
    if (isFirebaseConfigured()) {
      const docRef = await addDoc(collection(db, 'policies', policyId, 'comments'), {
        ...comment,
        timestamp: serverTimestamp()
      });
      
      // Update policy with new comment count and trigger AI analysis
      await updatePolicyAnalysis(policyId);
      
      return { id: docRef.id, ...comment };
    } else {
      // Use mock data
      const newComment = {
        id: Date.now().toString(),
        ...comment
      };
      if (!mockComments[policyId]) {
        mockComments[policyId] = [];
      }
      mockComments[policyId].unshift(newComment);
      return newComment;
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getComments = async (policyId: string) => {
  try {
    if (isFirebaseConfigured()) {
      const q = query(
        collection(db, 'policies', policyId, 'comments'), 
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : data.timestamp
        };
      });
    } else {
      // Return mock data
      return mockComments[policyId] || [];
    }
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Update policy with collective AI analysis
const updatePolicyAnalysis = async (policyId: string) => {
  try {
    const comments = await getComments(policyId);
    
    if (comments.length === 0) return;
    
    // Generate collective summary from all comments
    const allCommentsText = comments.map(c => c.text).join(' ');
    const { generateCollectiveSummary, analyzeCollectiveSentiment } = await import('./api');
    
    const aiSummary = await generateCollectiveSummary(allCommentsText, comments.length);
    const sentimentDistribution = analyzeCollectiveSentiment(comments);
    
    // Update policy document with AI analysis
    await updateDoc(doc(db, 'policies', policyId), {
      totalComments: comments.length,
      aiSummary,
      sentimentDistribution
    });
  } catch (error) {
    console.error('Error updating policy analysis:', error);
  }
};

// Get all comments across all policies for dashboard
export const getAllComments = async () => {
  try {
    if (isFirebaseConfigured()) {
      const policies = await getPolicies();
      const allComments = [];
      
      for (const policy of policies) {
        const comments = await getComments(policy.id);
        allComments.push(...comments);
      }
      
      return allComments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      // Return mock data
      const allComments = Object.values(mockComments).flat();
      return allComments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  } catch (error) {
    console.error('Error getting all comments:', error);
    throw error;
  }
};

export default firebaseConfig;