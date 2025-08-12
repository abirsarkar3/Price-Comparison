# PriceCompare - AI-Powered Price Comparison Platform

A modern, AI-powered price comparison platform for groceries, food delivery, and medicines across multiple platforms including Zepto, Blinkit, Swiggy, Zomato, Apollo, and more.

## 🚀 Features

- **AI Shopping Assistant** with cart optimization
- **Real-time Price Comparison** across multiple platforms
- **Smart Cart Management** with savings suggestions
- **User Authentication** via Firebase
- **Profile Management** with saved items and search history
- **Multi-language Support** (English, Hindi, Bengali)
- **Responsive Design** for all devices
- **Location-based Services** for accurate pricing

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Firebase
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Deployment**: Vercel
- **AI**: Custom AI Assistant with cart optimization

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Firebase project
- Google Cloud Platform account (for service account)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abirsarkar3/Price-Comparison.git
   cd Price-Comparison
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Functions
   - Download your service account key

4. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
   ```

5. **Set up Firebase Service Account**
   - Copy `lib/firebase-admin-key.template.json` to `lib/firebase-admin-key.json`
   - Fill in your actual Firebase service account credentials
   - **Important**: Never commit this file to version control!

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Live Demo

Visit the live application: [PriceCompare on Vercel](https://price-comparison-platform-d40ysdnsx-abirsarkar3s-projects.vercel.app)

## 📱 Key Features

### AI Shopping Assistant
- Smart cart optimization suggestions
- Price comparison across platforms
- Delivery optimization tips
- Quick action buttons for common tasks

### User Management
- Secure authentication via Firebase
- Profile management with saved items
- Search history tracking
- Cart management with optimization

### Price Comparison
- Real-time price fetching
- Multiple platform support
- Location-based pricing
- Deal and offer tracking

## 🔒 Security Features

- Firebase Authentication
- Environment variable protection
- Service account key exclusion
- Secure API endpoints
- Input validation and sanitization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Tailwind CSS for styling
- Vercel for deployment
- All contributors and supporters

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Contact: abirsarkar438@gmail.com

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Starring this repository
- Watching for updates
- Following the development progress

---

**Made with ❤️ by abirsarkar3** 