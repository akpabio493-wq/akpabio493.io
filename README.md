# TikTok MVP - Short-Form Video Sharing Platform

A full-stack, production-ready TikTok-style short-form video sharing application built with modern web technologies. Share, discover, and engage with vertical videos in an elegant, pixel-perfect interface.

**🌐 Live Demo:** [https://tiktokmvp-3ufqhfxp.manus.space](https://tiktokmvp-3ufqhfxp.manus.space)

---

## ✨ Features

### 🎬 Video Feed
- **Vertical scrolling feed** with auto-play using Intersection Observer
- **For You & Following tabs** for personalized content discovery
- **Creator info overlay** displaying username, avatar, and follow button
- **Captions and hashtags** for video context and discoverability
- **Smooth scrolling** with optimized performance

### ❤️ Engagement System
- **Like button** with heart animation and optimistic UI updates
- **Comment system** with threaded replies and real-time counts
- **Follow/Unfollow** creators with instant feedback
- **Real-time engagement counts** (likes, comments, followers)

### 📤 Video Upload
- **Drag-and-drop upload** with file validation
- **Video preview** before submission
- **Title, description, and tags** for video metadata
- **S3 storage integration** for reliable video hosting
- **Optimized video encoding** for fast playback

### 👤 User Profiles
- **Current user profile** with edit capabilities
- **Public profiles** accessible via /@username
- **Video grid** displaying user's uploaded videos
- **Follower/Following counts** and statistics
- **Follow/Unfollow button** on public profiles

### 🔐 Authentication
- **Manus OAuth** integration for secure login
- **Protected routes** that redirect unauthenticated users
- **Session management** with secure cookies
- **User role system** (admin/user)

### 📱 Responsive Design
- **Mobile-first design** with bottom navigation (Home, Upload, Profile)
- **Desktop layout** with right sidebar for suggested users
- **Fully responsive** across all screen sizes
- **Dark theme** optimized for video viewing

---

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling and responsive design
- **shadcn/ui** - Pre-built UI components
- **Vite** - Fast build tool and dev server
- **tRPC** - Type-safe API client

### Backend
- **Express 4** - Web framework
- **tRPC 11** - Type-safe RPC framework
- **Node.js** - Runtime environment

### Database
- **MySQL** - Relational database
- **Drizzle ORM** - Type-safe database queries
- **TiDB** - MySQL-compatible database (production)

### Storage
- **Amazon S3** - Video and media storage
- **Manus Storage** - Built-in file storage service

### Authentication
- **Manus OAuth** - Secure authentication provider
- **JWT** - Session token management

---

## 📋 Database Schema

### Tables

**users**
- `id` - Primary key
- `openId` - Manus OAuth identifier (unique)
- `name` - User's display name
- `email` - User's email address
- `loginMethod` - Authentication method
- `role` - User role (admin/user)
- `createdAt`, `updatedAt`, `lastSignedIn` - Timestamps

**videos**
- `id` - Primary key
- `userId` - Creator's user ID (foreign key)
- `title` - Video title
- `description` - Video description
- `videoUrl` - S3 storage URL
- `duration` - Video duration in seconds
- `tags` - Comma-separated hashtags
- `createdAt`, `updatedAt` - Timestamps

**likes**
- `id` - Primary key
- `userId` - User who liked (foreign key)
- `videoId` - Video being liked (foreign key)
- `createdAt` - Timestamp

**comments**
- `id` - Primary key
- `userId` - Comment author (foreign key)
- `videoId` - Video being commented on (foreign key)
- `parentCommentId` - For threaded replies
- `content` - Comment text
- `createdAt`, `updatedAt` - Timestamps

**follows**
- `id` - Primary key
- `followerId` - User following (foreign key)
- `followingId` - User being followed (foreign key)
- `createdAt` - Timestamp

**userProfiles**
- `id` - Primary key
- `userId` - User (foreign key)
- `bio` - User bio/description
- `avatarUrl` - Profile picture URL
- `updatedAt` - Timestamp

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- MySQL database
- GitHub account (for code management)
- Manus account (for deployment and OAuth)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/akpabio493-wq/akpabio493.io.git
   cd akpabio493.io
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure the following:
   - `DATABASE_URL` - MySQL connection string
   - `JWT_SECRET` - Session signing secret
   - `VITE_APP_ID` - Manus OAuth app ID
   - `OAUTH_SERVER_URL` - Manus OAuth server URL
   - `VITE_OAUTH_PORTAL_URL` - Manus login portal

4. **Run database migrations**
   ```bash
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
tiktok-mvp/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Feed.tsx            # Main video feed
│   │   │   ├── Upload.tsx          # Video upload page
│   │   │   ├── Profile.tsx         # User profile page
│   │   │   └── PublicProfile.tsx   # Public profile page
│   │   ├── components/
│   │   │   ├── feed/               # Feed components
│   │   │   │   ├── Feed.tsx
│   │   │   │   ├── FeedTabs.tsx
│   │   │   │   └── VideoCard.tsx
│   │   │   ├── video/              # Video player components
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   ├── VideoOverlay.tsx
│   │   │   │   ├── VideoActions.tsx
│   │   │   │   └── HeartAnimation.tsx
│   │   │   ├── comments/           # Comment components
│   │   │   │   ├── CommentSheet.tsx
│   │   │   │   ├── CommentList.tsx
│   │   │   │   └── CommentInput.tsx
│   │   │   ├── upload/             # Upload components
│   │   │   │   ├── UploadForm.tsx
│   │   │   │   └── VideoDropzone.tsx
│   │   │   ├── profile/            # Profile components
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   └── ProfileGrid.tsx
│   │   │   └── layout/             # Layout components
│   │   │       ├── BottomNav.tsx
│   │   │       ├── RightSidebar.tsx
│   │   │       └── MainLayout.tsx
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utilities and helpers
│   │   ├── App.tsx                 # Main app component
│   │   └── index.css               # Global styles
│   └── public/                     # Static assets
├── server/                         # Backend Express application
│   ├── routers/                    # tRPC route handlers
│   │   ├── video.ts               # Video operations
│   │   ├── user.ts                # User operations
│   │   └── comment.ts             # Comment operations
│   ├── db.ts                      # Database query helpers
│   ├── routers.ts                 # Main router setup
│   └── _core/                     # Framework core files
├── drizzle/                        # Database schema and migrations
│   ├── schema.ts                  # Table definitions
│   └── migrations/                # SQL migration files
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
└── README.md                       # This file
```

---

## 🔌 API Routes

### Video Operations
- `GET /api/trpc/video.getFeed` - Get paginated video feed
- `GET /api/trpc/video.getById` - Get video by ID
- `POST /api/trpc/video.upload` - Upload new video
- `POST /api/trpc/video.like` - Like/unlike video
- `GET /api/trpc/video.getLikeCount` - Get video like count

### User Operations
- `GET /api/trpc/user.me` - Get current user
- `GET /api/trpc/user.getById` - Get user by ID
- `GET /api/trpc/user.getByUsername` - Get user by username
- `POST /api/trpc/user.follow` - Follow/unfollow user
- `GET /api/trpc/user.getSuggested` - Get suggested users

### Comment Operations
- `GET /api/trpc/comment.getByVideoId` - Get video comments
- `POST /api/trpc/comment.post` - Post new comment
- `DELETE /api/trpc/comment.delete` - Delete comment

### Authentication
- `GET /api/oauth/callback` - OAuth callback handler
- `POST /api/trpc/auth.logout` - User logout

---

## 🎨 Design System

### Color Palette
- **Primary Background:** `#0a0a0a` (near black)
- **Secondary Background:** `#1a1a1a` (dark gray)
- **Text Primary:** `#ffffff` (white)
- **Text Secondary:** `#a0a0a0` (light gray)
- **Accent:** `#ef4444` (red - for likes and CTAs)

### Typography
- **Display:** Inter, 32px, bold
- **Heading:** Inter, 24px, semibold
- **Body:** Inter, 16px, regular
- **Caption:** Inter, 14px, regular

### Spacing
- **Base unit:** 4px
- **Small:** 8px
- **Medium:** 16px
- **Large:** 24px
- **XL:** 32px

---

## 🧪 Testing

Run tests with:
```bash
pnpm test
```

Tests are located in `server/*.test.ts` files and cover:
- Authentication flows
- API route handlers
- Database operations
- User interactions

---

## 📦 Deployment

### Deploy to Manus (Recommended)
1. Push changes to GitHub
2. Click "Publish" in Manus Management UI
3. App automatically deploys with SSL certificate

### Deploy to Other Platforms
The app can be deployed to any Node.js hosting platform:
- **Vercel** - Recommended for Next.js, but works with Express
- **Railway** - Simple Node.js deployment
- **Render** - Free tier available
- **Heroku** - Traditional Node.js hosting
- **AWS** - Full control with EC2/Lambda

**Build command:**
```bash
pnpm build
```

**Start command:**
```bash
pnpm start
```

---

## 🔐 Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/tiktok_mvp

# Authentication
JWT_SECRET=your_jwt_secret_key_here
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# Owner Info
OWNER_OPEN_ID=your_manus_open_id
OWNER_NAME=Your Name

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

---

## 🐛 Troubleshooting

### Videos not playing
- Ensure videos are uploaded to S3 or Manus storage
- Check video codec compatibility (H.264 recommended)
- Verify CORS headers are properly configured

### Authentication issues
- Clear browser cookies and try again
- Verify OAuth credentials in `.env.local`
- Check that callback URL matches Manus OAuth settings

### Database connection errors
- Verify `DATABASE_URL` is correct
- Ensure database server is running
- Check network connectivity to database

### Build errors
- Run `pnpm install` to ensure all dependencies are installed
- Clear `.next` or `dist` directories
- Check TypeScript errors with `pnpm check`

---

## 📚 Documentation

- [Manus Documentation](https://docs.manus.im)
- [tRPC Documentation](https://trpc.io)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**akpabio493-wq** - [GitHub Profile](https://github.com/akpabio493-wq)

---

## 🙏 Acknowledgments

- Built with [Manus](https://manus.im) - AI-powered web development platform
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Type-safe APIs with [tRPC](https://trpc.io)

---

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/akpabio493-wq/akpabio493.io/issues)
- Check [Discussions](https://github.com/akpabio493-wq/akpabio493.io/discussions)
- Visit [Manus Help Center](https://help.manus.im)

---

**Happy coding! 🚀**
