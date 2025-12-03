# Student AI Projects Showcase

A stunning mobile-first web showcase featuring interactive student projects built with AI assistance. This portfolio demo showcases what students can create with modern web technologies.

![Student Projects Showcase](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=flat-square&logo=framer)

## Features

- **Mobile-First Design**: Optimized for touch devices with full desktop support
- **Swipeable Carousel**: Smooth gesture-based navigation through projects
- **Interactive Mini-Apps**: 8 fully functional demo applications
- **Beautiful Animations**: Framer Motion powered transitions and micro-interactions
- **Vercel Ready**: Optimized for instant deployment

## The Apps

| App | Creator | Description |
|-----|---------|-------------|
| 🎵 **MoodMixer** | Maya Chen | AI-powered mood-based playlist generator |
| 🐾 **PixelPets** | Jake Rodriguez | Retro virtual pet game with modern twist |
| 📚 **StudyBuddy** | Priya Sharma | Smart flashcards with spaced repetition |
| 🧋 **BudgetBoba** | Kevin Wu | Boba-themed expense tracker |
| 📸 **VibeCam** | Zara Johnson | Chaotic good photo filters |
| ✨ **CodePoetry** | Alex Okonkwo | Transform code into beautiful poetry |
| 👥 **GroupSync** | Emma Nakamura | Study group coordination app |
| 🎨 **NeuralDoodle** | Marcus Lee | AI-powered doodle completion |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd student-showcase

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the showcase.

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

The easiest way to deploy is with [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository on Vercel
3. Deploy with default settings

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Fonts**: Inter & Space Grotesk (Google Fonts)

## Project Structure

```
student-showcase/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── apps/           # Individual mini-apps
│   │   │   ├── MoodMixer.tsx
│   │   │   ├── PixelPets.tsx
│   │   │   ├── StudyBuddy.tsx
│   │   │   ├── BudgetBoba.tsx
│   │   │   ├── VibeCam.tsx
│   │   │   ├── CodePoetry.tsx
│   │   │   ├── GroupSync.tsx
│   │   │   └── NeuralDoodle.tsx
│   │   └── ui/             # UI components
│   │       ├── AppModal.tsx
│   │       ├── BackgroundParticles.tsx
│   │       ├── Carousel.tsx
│   │       └── ProjectCard.tsx
│   └── lib/
│       ├── projects.ts     # Project data
│       └── types.ts        # TypeScript types
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## Customization

### Adding New Projects

1. Create a new component in `src/components/apps/`
2. Add the project data to `src/lib/projects.ts`
3. Register the component in `src/components/ui/AppModal.tsx`

### Changing Themes

Edit the gradient colors in `src/lib/projects.ts` and global styles in `src/app/globals.css`.

## Performance

- Optimized with Next.js automatic code splitting
- Dynamic imports for mini-apps (loaded on demand)
- Efficient animations with hardware acceleration
- Responsive images and optimized fonts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ and AI assistance
