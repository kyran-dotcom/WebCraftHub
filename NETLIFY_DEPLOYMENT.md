# Deploying to GitHub Pages

Follow these steps to deploy your maths.k.com website to GitHub Pages for free:

## Step 1: Create a GitHub Account (if you don't have one)
- Go to [github.com](https://github.com)
- Sign up for a free account

## Step 2: Prepare Your Project
1. Download your project as a ZIP file from Replit
   - Click the three dots menu in Replit
   - Select "Download as ZIP"

2. Extract the ZIP file to your local computer

## Step 3: Create a New GitHub Repository
1. Log in to GitHub
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "maths-k-com")
4. Make it public
5. Click "Create repository"

## Step 4: Prepare the Project for GitHub Pages
1. In your local project folder, open a terminal/command prompt
2. Run the build process:
   ```
   npm install
   npm run build
   ```
3. You'll find the built files in the `dist/public` folder

## Step 5: Upload to GitHub
1. Initialize a git repository in your project folder:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Connect to your GitHub repository (replace with your actual repository URL):
   ```
   git remote add origin https://github.com/yourusername/maths-k-com.git
   git branch -M main
   git push -u origin main
   ```

## Step 6: Set Up GitHub Pages
1. In your GitHub repository, go to "Settings"
2. Scroll down to the "GitHub Pages" section
3. Under "Source", select "main" branch and "/docs" folder
4. Click "Save"

5. Create a docs folder for GitHub Pages:
   - On your local computer, rename the `dist/public` folder to `docs`
   - Push the changes:
   ```
   git add .
   git commit -m "Add docs folder for GitHub Pages"
   git push
   ```

## Step 7: Access Your Website
1. Your website will be available at `https://yourusername.github.io/maths-k-com/`
2. You can check the status of your deployment in the "GitHub Pages" section of your repository settings

## Optional: Use a Custom Domain
1. If you have a custom domain like "maths.k.com", you can configure it in the GitHub Pages settings
2. Follow GitHub's instructions to set up DNS records with your domain provider

Your site is now deployed and accessible to anyone on the internet!