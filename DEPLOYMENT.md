# Deployment Guide: GitHub + Netlify

This guide will walk you through deploying your PDF Fortress app to Netlify via GitHub.

## Prerequisites

- A GitHub account
- A Netlify account (free tier is sufficient)
- Git installed on your computer

## Step 1: Initialize Git Repository (if not already done)

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
git add .
git commit -m "Initial commit: PDF password protection app"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `pdf-pass` (or your preferred name)
   - **Description**: "Secure PDF password protection web app"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 3: Push Code to GitHub

GitHub will show you commands to push an existing repository. Run these in your terminal:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/pdf-pass.git

# Push your code
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Deploy to Netlify

### Option A: Via Netlify Dashboard (Recommended)

1. Go to [Netlify](https://app.netlify.com) and log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select your `pdf-pass` repository
6. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: (leave empty, auto-detected)
7. Click **"Deploy site"**

### Option B: Via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: (your choice or leave blank for random)
# - Build command: npm run build
# - Directory to deploy: .next
```

## Step 5: Configure Custom Domain (Optional)

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your DNS

## Step 6: Verify Deployment

1. Netlify will provide a URL like `https://your-site-name.netlify.app`
2. Visit the URL and test the app:
   - Upload a PDF
   - Set a password
   - Download the protected file
   - Verify the password protection works

## Continuous Deployment

Once set up, Netlify will automatically deploy whenever you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push origin main

# Netlify will automatically build and deploy!
```

## Troubleshooting

### Build Fails

- Check the Netlify build logs for errors
- Ensure `package.json` has all dependencies listed
- Verify Node.js version compatibility (use Node 20+)

### Function Timeout

- Netlify functions have a 10-second timeout on free tier
- For large PDFs (>5MB), consider upgrading or using Firebase

### Environment Variables

If you add any environment variables later:
1. Go to **Site settings** → **Environment variables**
2. Add your variables
3. Redeploy the site

## Need Help?

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Help](https://docs.github.com/)

---

**Your app is now live! 🎉**
