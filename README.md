# Fire Extinguisher Maintenance Tracker

A comprehensive web application for tracking and managing fire extinguisher maintenance with QR code functionality.

## 🚀 Features

- **QR Code Generation**: Generate unique QR codes for each fire extinguisher
- **QR Code Scanning**: Scan QR codes to access extinguisher information
- **Maintenance Logging**: Track maintenance history and schedules
- **Real-time Updates**: Live updates using WebSocket connections
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: SQLite with Drizzle ORM
- **QR Code**: React QR Code, QR Scanner
- **State Management**: TanStack Query
- **Routing**: Wouter

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dharmendrakumardev/ExtinguisherTracker.git
   cd ExtinguisherTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### GitHub Pages (Static Frontend)

The frontend is automatically deployed to GitHub Pages when you push to the main branch.

**Live Demo**: [https://dharmendrakumardev.github.io/ExtinguisherTracker/](https://dharmendrakumardev.github.io/ExtinguisherTracker/)

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build:client
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

## 📁 Project Structure

```
ExtinguisherTracker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
│   └── index.html
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── db.ts              # Database configuration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema
└── dist/                   # Build output
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build both frontend and backend
- `npm run build:client` - Build only frontend
- `npm run start` - Start production server
- `npm run deploy` - Deploy to GitHub Pages
- `npm run db:push` - Push database schema changes

## 🌐 API Endpoints

- `GET /api/extinguishers` - Get all extinguishers
- `POST /api/extinguishers` - Create new extinguisher
- `GET /api/extinguishers/:id` - Get specific extinguisher
- `PUT /api/extinguishers/:id` - Update extinguisher
- `DELETE /api/extinguishers/:id` - Delete extinguisher
- `GET /api/maintenance/:id` - Get maintenance history
- `POST /api/maintenance` - Add maintenance record

## 📱 Usage

1. **Generate QR Codes**: Create new extinguisher entries to generate QR codes
2. **Scan QR Codes**: Use the camera scanner to access extinguisher information
3. **Track Maintenance**: Log maintenance activities and view history
4. **Monitor Status**: Check extinguisher status and maintenance schedules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dharmendra Kumar**
- GitHub: [@Dharmendrakumardev](https://github.com/Dharmendrakumardev)
- Email: dharmkumar.dev@gmail.com

---

⭐ Star this repository if you find it helpful! 