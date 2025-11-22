# PDF Fortress

A secure, privacy-focused web application for creating password-protecting PDF files. Built with Next.js and Tailwind CSS.

## Features

- 🔒 **Password Protection**: Encrypt PDFs with AES-256 encryption
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations
- 🚀 **Fast Processing**: Server-side encryption with immediate download
- 🔐 **Privacy First**: Files are processed in memory and deleted immediately
- ✅ **Password Confirmation**: Double-entry validation to prevent typos
- 📱 **Responsive**: Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **PDF Processing**: Muhammara (native C++ bindings)
- **Icons**: Lucide React
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/pdf-pass.git
cd pdf-pass
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Log in to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Click "Deploy site"

Netlify will automatically deploy your site and provide a URL.

### Environment Variables

No environment variables are required for basic functionality.

## File Size Limits

- **Netlify**: ~6MB per file
- **Vercel**: 4.5MB per file
- **Firebase**: Up to 512MB (recommended for larger files)

## How It Works

1. User uploads a PDF file
2. User enters and confirms a password
3. File is sent to the server API endpoint
4. Server encrypts the PDF using Muhammara with AES-256
5. Encrypted file is streamed back to the browser
6. Temporary files are immediately deleted from the server
7. User downloads the protected PDF

## Security

- Files are never permanently stored on the server
- Temporary files are deleted immediately after processing
- AES-256 encryption with user-defined passwords
- No analytics or tracking

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
