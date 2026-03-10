


Build a production-ready backend API for a music streaming platform called Spookify.

Tech stack:

* Node.js
* Express.js
* PostgreSQL
* Docker-ready architecture
* Environment variables for configuration
* Modular folder structure

Required project structure:

backend/
src/
controllers/
routes/
services/
middleware/
config/
uploads/
Dockerfile
docker-compose.yml
package.json
server.js

API endpoints:

GET /api/songs
GET /api/songs/:id
GET /api/search?q=
POST /api/upload
POST /api/playlists
GET /api/playlists

Database schema:

songs

* id (uuid primary key)
* title
* artist
* genre
* cover_url
* audio_url
* duration

playlists

* id
* name

playlist_songs

* playlist_id
* song_id

Requirements:

* Use multer for audio uploads
* Store uploaded files locally in /uploads
* Prepare storage abstraction so it can later be switched to S3
* Add a /health endpoint for monitoring
* Use dotenv for configuration
* Use connection pooling for PostgreSQL

DevOps requirements:

* Provide a Dockerfile
* Provide docker-compose with services:

services:
backend
postgres

The backend should listen on port 5000.

The code should be structured so it can later be deployed behind an Nginx reverse proxy.













# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
