# Phonics AI

An interactive, game-based phonics learning web app for ages 9-15. Built with Next.js, Firebase, and AI-powered features using Google's Gemini API.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://alfredang.github.io/phonics-ai/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

## Live Demo

**[https://alfredang.github.io/phonics-ai/](https://alfredang.github.io/phonics-ai/)**

## About

Phonics AI helps students master English pronunciation through a structured learning journey:

- **5 Learning Worlds**: Progress from basic letter sounds to fluent reading
- **44 Phonemes**: Complete coverage of English sounds with IPA notation
- **4-Phase Lessons**: Listen → Practice → Play → Assess
- **Interactive Games**: Phoneme Pop, Word Builder, Sound Match, and more
- **Gamification**: XP system, achievements, daily quests, and streaks
- **Speech Features**: Text-to-speech pronunciation and voice recording
- **Visual Aids**: Animated mouth positions for each sound

## Tech Stack

### Frontend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 14.2 | React framework with App Router |
| [React](https://react.dev/) | 18.3 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 5.0 | Type-safe JavaScript |

### Styling & Animation
| Technology | Version | Purpose |
|------------|---------|---------|
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS framework |
| [Framer Motion](https://www.framer.com/motion/) | 11.15 | Animation library |
| [clsx](https://github.com/lukeed/clsx) | 2.1 | Conditional class names |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 2.6 | Merge Tailwind classes |

### State Management
| Technology | Version | Purpose |
|------------|---------|---------|
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.0 | Lightweight state management |

### Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| [Firebase Auth](https://firebase.google.com/products/auth) | 11.1 | User authentication |
| [Cloud Firestore](https://firebase.google.com/products/firestore) | 11.1 | NoSQL database |
| [Firebase SDK](https://firebase.google.com/) | 11.1 | Firebase client library |

### AI & Speech
| Technology | Purpose |
|------------|---------|
| [Google Gemini API](https://ai.google.dev/) | AI-powered features |
| [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | Text-to-speech & speech recognition |

### Development Tools
| Technology | Purpose |
|------------|---------|
| [ESLint](https://eslint.org/) | Code linting |
| [PostCSS](https://postcss.org/) | CSS processing |
| [GitHub Actions](https://github.com/features/actions) | CI/CD deployment |

### Deployment
| Platform | Purpose |
|----------|---------|
| [GitHub Pages](https://pages.github.com/) | Static site hosting |
| Next.js Static Export | Build output |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account
- Google AI Studio account (for Gemini API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alfredang/phonics-ai.git
   cd phonics-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Firebase** (see Firebase Setup below)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., `phonics-ai`)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Register Your Web App

1. In Firebase Console, click the Web icon (`</>`)
2. Enter app nickname: `phonics-ai-web`
3. Click "Register app"
4. Copy the config values shown

### Step 3: Enable Authentication

1. Go to **Build → Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider

### Step 4: Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click "Create database"
3. Select "Start in test mode"
4. Choose a location closest to your users
5. Click "Enable"

### Step 5: Configure Security Rules

In Firestore → Rules tab, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /gameStates/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /lessonProgress/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click "Publish" to save.

### Step 6: Add Credentials to Your Project

Edit `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

## Deployment

### GitHub Pages

The project is configured for GitHub Pages deployment via GitHub Actions.

1. **Add GitHub Secrets**

   Go to your repo → Settings → Secrets → Actions, and add:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_GEMINI_API_KEY`

2. **Enable GitHub Pages**

   Go to Settings → Pages → Source → Select "GitHub Actions"

3. **Push to main branch**

   The workflow will automatically build and deploy.

### Manual Build

```bash
npm run build
```

The static site will be generated in the `out/` directory.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   └── (dashboard)/       # Protected app pages
├── components/
│   ├── ui/                # Base UI components
│   ├── phonics/           # Phoneme display components
│   ├── audio/             # Audio/speech components
│   ├── games/             # Game components
│   ├── lesson/            # Lesson phase components
│   └── gamification/      # XP, achievements, quests
├── stores/                # Zustand state stores
├── lib/
│   ├── firebase/          # Firebase configuration
│   └── audio/             # Audio utilities
├── types/                 # TypeScript type definitions
├── constants/             # Phonemes, lessons, worlds data
└── hooks/                 # Custom React hooks
```

## Learning Worlds

| World | Focus | Target Age |
|-------|-------|------------|
| Letters Land | Individual letter sounds | 9-10 |
| Word City | CVC words, blending | 10-11 |
| Sentence Street | Simple sentences | 11-12 |
| Paragraph Park | Connected text | 12-13 |
| Story Kingdom | Fluent reading | 13-15 |

## Features

### Phonics System
- 44 English phonemes with IPA notation
- Color-coded by category (vowels, consonants, digraphs)
- Animated mouth position guides
- Audio pronunciation with Web Speech API

### Games
- **Phoneme Pop**: Tap bubbles with the target sound
- **Word Builder**: Drag letter tiles to build words
- **Sound Match**: Memory matching with audio
- **Sound Race**: Speed-based phoneme identification
- **Sentence Scramble**: Arrange words in order
- **Karaoke Challenge**: Follow-along reading

### Gamification
- XP earned for completing lessons and games
- Level progression system
- Achievement badges
- Daily quests
- Streak tracking

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Phoneme data based on standard American English pronunciation
- Built with assistance from Claude AI
