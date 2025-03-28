# Simple GitHub Pages Deployment Guide for Maths.k.com

## Step 1: Download Your Project
1. From Replit, download your entire project as a ZIP file
   - Click the three dots menu (⋮) at the top
   - Select "Download as ZIP"
2. Extract this ZIP file to your computer

## Step 2: Create a GitHub Account & Repository
1. Go to [github.com](https://github.com) and sign up (it's free)
2. Once logged in, click the "+" button in the top-right corner and select "New repository"
3. Name your repository (e.g., "maths-k-com")
4. Make it public (this is required for the free GitHub Pages)
5. Click "Create repository"

## Step 3: Build Your Website
1. Open a command prompt or terminal on your computer
2. Navigate to your project folder
3. Run these commands:
   ```
   npm install
   npm run build
   ```
4. This creates a `dist/public` folder with your built website

## Step 4: Prepare for GitHub Pages
1. Create a new folder called `docs` at the root of your project
2. Copy everything from `dist/public` into the `docs` folder

## Step 5: Upload to GitHub
1. In your project folder, open a command prompt/terminal and run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/maths-k-com.git
   git push -u origin main
   ```
   (Replace YOUR-USERNAME with your actual GitHub username)

## Step 6: Enable GitHub Pages
1. Go to your repository on GitHub.com
2. Click "Settings" tab
3. Scroll down to "GitHub Pages" section
4. Under "Source", select "main" branch and "/docs" folder
5. Click "Save"
6. Wait a few minutes for GitHub to publish your site

## Step 7: View Your Website
Your website will be available at:
`https://YOUR-USERNAME.github.io/maths-k-com/`

That's it! Your maths.k.com website is now live on the internet for free!