import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { TechnologiesPage } from './pages/TechnologiesPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { JourneyPage } from './pages/JourneyPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { MediaLibraryPage } from './pages/MediaLibraryPage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsPage } from './pages/SettingsPage';
import { InterestsPage } from './pages/InterestsPage';
import { ProcessPage } from './pages/ProcessPage';
import { SocialMediaPage } from './pages/SocialMediaPage';
import { BlogPage } from './pages/BlogPage';


export const router = createBrowserRouter([
  { path: '/login', Component: LoginPage },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'profile', Component: ProfilePage },
      { path: 'technologies', Component: TechnologiesPage },
      { path: 'services', Component: ServicesPage },
      { path: 'projects', Component: ProjectsPage },
      { path: 'journey', Component: JourneyPage },
      { path: 'process', Component: ProcessPage },
      { path: 'achievements', Component: AchievementsPage },
      { path: 'media', Component: MediaLibraryPage },
      { path: 'messages', Component: MessagesPage },
      { path: 'interests', Component: InterestsPage },
      { path: 'settings', Component: SettingsPage },
      { path: 'social-media', Component: SocialMediaPage },
      { path: 'blog', Component: BlogPage },

    ],
  },
  { path: '*', Component: () => <Navigate to="/" replace /> },
]);
