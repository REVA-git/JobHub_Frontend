To Deploy the Frontend:-

Install the following dependecies:-
npm install axios react-router-dom
npm install @auth/auth)-react

Open an command prompt and move into the root directory and run the following commands to deploy it on vercel:-
npm i -g vercel
vercel login
vercel

After you deploy the project on vercel, head to the settings and change the Build command to "npm run build" and development command to "npm start"

Set the follwoing environemntal variables on vercel:-

REACT_APP_GITHUB_CLIENT_ID = your_github_client_id (you can find the client id in github head to settings --> developer settings --> OAuth Apps --> select the app you created )
REACT_APP_API_BASE_URL = your server url ex:-https://job-ui-server.onrender.com

To Push any new changes to vercel run "vercel --prod" in the cmd
Note:- Update the config.js and displayjobs.js files
