# Deploying to Vercel

Follow these steps to deploy your maths.k.com website to Vercel for free:

## Step 1: Create a Vercel Account
- Go to [vercel.com](https://vercel.com/)
- Sign up for a free account (you can use GitHub, GitLab, or email)

## Step 2: Prepare Your Project
1. Download your project as a ZIP file from Replit
   - Click the three dots menu in Replit
   - Select "Download as ZIP"

2. Extract the ZIP file to your local computer

## Step 3: Create a GitHub Repository (Optional but Recommended)
1. Log in to GitHub
2. Create a new repository
3. Upload your project files to this repository

## Step 4: Deploy to Vercel
1. Log in to your Vercel account
2. Click "Add New..." > "Project"
3. Import your GitHub repository (or use the "Upload" option if you didn't create a repository)
4. Configure your project:
   - Framework Preset: Select "Vite"
   - Root Directory: Leave as is (unless your project is in a subdirectory)
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
5. Click "Deploy"

## Step 5: Configure Your Site
1. Once deployed, your site will be available at a URL like `your-project-name.vercel.app`
2. You can change the project name in your Vercel project settings

## Step 6: Set Environment Variables (if needed)
1. In your Vercel project dashboard, go to "Settings" > "Environment Variables"
2. Add any environment variables your application needs

## Optional: Connect a Custom Domain
1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain (like "maths.k.com")
3. Follow Vercel's instructions to set up DNS records with your domain provider

## Automatic Deployments
If you connected a GitHub repository, Vercel will automatically redeploy your site whenever you push changes to your repository.

Your site is now deployed and accessible to anyone on the internet!