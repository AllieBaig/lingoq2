



# LingoQuest - Language Learning Adventure

An interactive Progressive Web App (PWA) for language learning through gamified quests and challenges. Built with SvelteKit and designed for offline-first functionality.

## Features

- 🎮 **Gamified Learning**: Progress through language quests with XP, levels, and achievements
- 📱 **PWA Support**: Install on any device, works offline
- 🌍 **Multiple Languages**: Support for various language pairs
- 📊 **Progress Tracking**: Detailed analytics and learning streaks
- 🔄 **Offline Sync**: Continue learning without internet, sync when online
- 🎯 **Adaptive Difficulty**: Lessons adjust to your skill level
- 🏆 **Achievements**: Unlock badges and compete with friends
- 📱 **Responsive Design**: Works perfectly on mobile and desktop

## Tech Stack

- **Frontend**: SvelteKit, Svelte 4
- **Styling**: CSS Variables, Custom CSS
- **PWA**: Service Worker, Web App Manifest
- **Icons**: Lucide Svelte
- **Build Tool**: Vite
- **Deployment**: Static adapter for various hosting platforms

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AllieBaig/LingoQuest.git
cd LingoQuest
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `build` directory, ready for deployment.

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable Svelte components
│   ├── stores/         # Svelte stores for state management
│   ├── utils/          # Utility functions
│   └── data/           # Static data and content
├── routes/             # SvelteKit routes
├── styles/             # Global CSS and variables
└── app.html            # HTML template

static/
├── icons/              # PWA icons
├── manifest.json       # Web app manifest
└── sw.js              # Service worker
```

## PWA Features

LingoQuest is a full-featured Progressive Web App:

- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Core functionality works without internet
- **Background Sync**: Progress syncs when connection returns
- **Push Notifications**: Daily learning reminders
- **App Shortcuts**: Quick access to lessons and progress

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type checking
- `npm run lint` - Lint code
- `npm run format` - Format code

### Code Style

The project uses Prettier for code formatting. Run `npm run format` to format all files.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- SvelteKit team for the amazing framework
- Lucide for the beautiful icons
- Inter font family for typography
- The language learning community for inspiration

## Roadmap

- [ ] Voice recognition for pronunciation practice
- [ ] Social features and leaderboards
- [ ] More language pairs
- [ ] Advanced analytics dashboard
- [ ] Native mobile apps
- [ ] AI-powered personalized learning paths

## Support

If you encounter any issues or have questions, please file an issue on GitHub or contact the development team.

---

Happy learning! 🚀📚

