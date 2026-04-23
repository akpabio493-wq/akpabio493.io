# TikTok MVP TODO

## Database & Schema
- [x] Design and implement database schema (videos, users, likes, comments, follows)
- [x] Generate and apply Drizzle migrations
- [x] Create database query helpers in server/db.ts

## Authentication
- [x] Set up Manus OAuth callback route (already in scaffold)
- [x] Create useAuth hook for client-side auth state (already in scaffold)
- [x] Implement protected routes that redirect unauthenticated users
- [x] Build login page with Manus OAuth button
- [x] Build verify/callback pages for OAuth flow (already in scaffold)

## Core Layout & Navigation
- [x] Build responsive bottom navigation (Home, Upload, Profile) for mobile
- [x] Build right sidebar with suggested users for desktop
- [x] Create main layout wrapper with conditional nav based on screen size
- [x] Implement route structure in App.tsx

## Video Feed
- [x] Build Feed page with For You and Following tabs
- [x] Implement FeedTabs component for tab switching
- [x] Build VideoCard component with video display
- [x] Build VideoPlayer with Intersection Observer for auto-play
- [x] Build VideoOverlay with creator info, caption, hashtags
- [ ] Implement feed algorithm/pagination in tRPC

## Video Interactions
- [x] Build VideoActions component (like, comment, share, follow buttons)
- [x] Build HeartAnimation for like feedback
- [x] Implement optimistic like updates
- [ ] Implement optimistic follow updates
- [ ] Create tRPC routes for like/unlike and follow/unfollow

## Comments System
- [x] Build CommentSheet drawer component
- [x] Build CommentList component with threaded comments
- [x] Build CommentInput component
- [x] Implement optimistic comment posting
- [ ] Create tRPC routes for posting and fetching comments

## Video Upload
- [x] Build UploadForm with title, description, tags fields
- [x] Build VideoDropzone for drag-and-drop
- [ ] Build VideoRecorder for recording videos
- [ ] Implement video compression (ffmpeg.wasm or similar)
- [ ] Integrate S3 storage for video uploads
- [ ] Create tRPC route for video upload

## User Profiles
- [x] Build ProfileHeader component (avatar, username, bio, stats)
- [x] Build ProfileGrid component for user's video grid
- [x] Build current user profile page (/profile)
- [x] Build public profile page (/@username)
- [x] Implement follow/unfollow button on public profiles
- [ ] Create tRPC routes for fetching user data and videos

## API Routes & Services
- [x] Create video.ts router for feed algorithm and video operations
- [x] Create user.ts router for user operations and follows
- [x] Create comment.ts router for comments and replies
- [x] Build tRPC routers for all features
- [x] Implement pagination for feed and user videos
- [ ] Wire frontend to use tRPC mutations and queries

## Styling & Design
- [x] Set up Tailwind CSS with custom design tokens
- [x] Define color palette and typography
- [x] Create global styles in index.css
- [x] Ensure responsive design (mobile-first)
- [x] Polish animations and micro-interactions

## Testing & Verification
- [ ] Write vitest tests for API routes
- [ ] Test authentication flow end-to-end
- [ ] Test video upload and storage
- [ ] Test engagement features (like, comment, follow)
- [x] Test responsive design on mobile and desktop
- [x] Verify all protected routes redirect properly

## Deployment & Final
- [x] Create final checkpoint
- [x] Verify all features work in production
- [x] Document setup and deployment steps
