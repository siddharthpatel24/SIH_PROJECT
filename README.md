# SIH 2024 - Policy Consultation Platform

A comprehensive platform for government policy consultation and citizen feedback analysis, built for Smart India Hackathon 2024.

## 🎯 Problem Statement

**Sentiment analysis of comments received through e-Consultation module**

Government policies need public consultation before implementation. This platform enables officials to post policies, citizens to provide feedback, and uses AI to analyze sentiment for better policy-making decisions.

## ✨ Features

- **Policy Management**: Government officials can post new policies for public consultation
- **Citizen Engagement**: Citizens can browse policies and provide feedback like social media posts
- **Real-time Sentiment Analysis**: AI-powered classification of feedback as positive, negative, or neutral
- **AI-Generated Summaries**: Automatic summarization of citizen feedback
- **Visual Analytics**: Interactive charts, word clouds, and sentiment distribution graphs
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI/UX**: Premium design with smooth animations

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: Firebase Firestore
- **AI**: Mock functions (ready for real AI integration)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sih-policy-consultation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Firebase configuration.

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Firebase Integration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy your Firebase configuration
4. Update `.env` file with your Firebase credentials

### Environment Variables

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 📱 Pages & Features

### Home Page
- Problem statement explanation
- Feature highlights
- Call-to-action buttons

### Add Policy Page (Admin)
- Policy creation form
- Title and description fields
- Publishing to public feed

### Policies Feed Page (Citizens)
- Instagram-like policy feed
- Comment submission under each policy
- Real-time sentiment analysis
- AI-generated summaries
### Dashboard Page
- Policy and feedback statistics
- Sentiment distribution charts
- Word cloud visualization
- Recent activity feed

## 🤖 AI Integration

Currently uses mock AI functions for development. Ready for integration with:

- **Sentiment Analysis**: Integration points ready for services like Google Cloud Natural Language, AWS Comprehend, or custom models
- **Text Summarization**: Ready for OpenAI GPT, Google PaLM, or other summarization APIs
- **Word Processing**: Built-in word frequency analysis for word clouds

## 🎨 Design System

- **Colors**: Blue/Indigo gradient theme with semantic colors
- **Typography**: Responsive font scaling with proper hierarchy
- **Components**: Glass-morphism cards with subtle animations
- **Spacing**: 8px grid system
- **Responsive**: Mobile-first design approach

## 🔥 Firebase Collections

### Policies Collection
```
policies/
├── {policyId}/
│   ├── title: string
│   ├── description: string
│   ├── createdAt: timestamp
│   └── comments/
│       └── {commentId}/
│           ├── text: string
│           ├── sentiment: string
│           ├── summary: string
│           ├── confidence: number
│           └── timestamp: timestamp
```
## 🚀 Deployment

Ready for deployment on:
- **Netlify** (Recommended)
- **Vercel**
- **Firebase Hosting**

Build command: `npm run build`
Output directory: `dist`

## 🛠️ Development

### Project Structure
```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── services/         # Firebase and AI services
├── App.tsx           # Main app component
└── main.tsx         # App entry point
```

### Adding Features

1. **Real AI Integration**: Update `src/services/api.ts`
2. **New Components**: Add to `src/components/`
3. **New Pages**: Add to `src/pages/` and update routing
4. **Styling**: Use Tailwind classes, custom CSS in `src/index.css`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## 📄 License

This project is developed for Smart India Hackathon 2024.

## 🆘 Support

For questions or support:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Made with ❤️ for Smart India Hackathon 2024**