# Langit Digital Media Platform

Platform media digital terpercaya untuk mengelola dan mengakses konten audio, PDF, video, dan file lainnya.

## 🚀 Features

- **User Management**: Sistem login untuk pengguna dan admin
- **Content Management**: Kelola audio, PDF, video, dan file cloud
- **Category System**: Organisasi konten berdasarkan kategori
- **Audio Player**: Player audio terintegrasi dengan kontrol lengkap
- **Download System**: Download file dengan progress tracking
- **Responsive Design**: Tampilan optimal di semua perangkat
- **Admin Panel**: Panel admin lengkap untuk manajemen sistem

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase
- **Authentication**: Custom authentication system
- **Routing**: React Router DOM
- **State Management**: React Context API

## 📦 Installation

1. Clone repository:
```bash
git clone https://github.com/your-username/langit-digital-platform.git
cd langit-digital-platform
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Configure your Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run development server:
```bash
npm run dev
```

## 🚀 Deployment

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
   - Push your code to GitHub
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/dist` folder
   - Your site will be available at `https://your-username.github.io/repository-name/`

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder contents to your web server.

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── admin/          # Admin panel components
│   └── user/           # User panel components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── pages/              # Page components
├── utils/              # Utility functions
└── lib/                # Library configurations

public/                 # Static assets
supabase/              # Database migrations
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- `users` - User accounts and authentication
- `admins` - Admin accounts
- `categories` - Content categories
- `audios` - Audio files
- `pdfs` - PDF files
- `videos` - Video files
- `audio_cloud_files` - Cloud audio files
- `pdf_cloud_files` - Cloud PDF files
- `file_cloud_files` - Other cloud files
- User access tables for permissions

## 🔐 Authentication

The application uses a custom authentication system with:

- User login with phone number and access code
- Admin login with email and access code
- Role-based access control
- Session management with localStorage

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Design System

- **Colors**: Blue and purple gradient theme
- **Typography**: System fonts with proper hierarchy
- **Components**: Consistent design patterns
- **Icons**: Lucide React icon library
- **Animations**: Smooth transitions and micro-interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@langitdigital.com or create an issue in this repository.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Langit Digital** - Platform Media Digital Terpercaya © 2025