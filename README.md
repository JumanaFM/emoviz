# EmoViz

![EmoViz](/screenshot_1.png)

## About

The project consist of 3 part:
- Background - Handles the Models and Transcribing the audio.
- Backend (API) - a communication point between all parts including the DB (MongoDB).
-  Frontend - Handles the user interactions and requests.

## How to run

### Preperation
Before running the app you need prepare the following:
- Registering and acquiring `GOOGLE_APPLICATION_CREDENTIALS` to handle all the audio transcribing through Google Cloud.
- installing and running MongoDB.


### Starting Backround (Models)
By following theses steps:
- open a new terminal.
- navigate to this directory: `emoviz/emoviz-background`
- export `GOOGLE_APPLICATION_CREDENTIALS` using these command `export GOOGLE_APPLICATION_CREDENTIALS="PATH/TO/JSON/FILE"`
- run `npm install`
- run `npm start`
- All Done, the background task will run every 10 sec.

### Starting Backend
By following theses steps:
- open a new terminal.
- navigate to this directory: `emoviz/emoviz-backend`
- run `npm install`
- run `npm start`
- All Done, the backend API will wait for requests on `http://127.0.0.1:3002`.

### Starting Frontend
By following theses steps:
- open a new terminal.
- navigate to this directory: `emoviz/emoviz-frontend`
- run `npm install`
- run `npm start`
- All Done, the frontend will be accessible on `http://127.0.0.1:3000`.

## Tool and Services
- Node.js
- express
- Google Cloud Speech
- Google Cloud Storage
- MongoDB

## License
MIT
