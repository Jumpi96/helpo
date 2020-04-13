# helpo ![helpo-api units](https://github.com/Jumpi96/helpo/workflows/helpo-api%20units/badge.svg) ![helpo-web units](https://github.com/Jumpi96/helpo/workflows/helpo-web%20units/badge.svg)

> Proyecto Final - UTN FRC - 2018

Created with [Django React Boilerplate](https://github.com/vintasoftware/django-react-boilerplate).

## Conventions
### Coding
- **Python:** PEP 8 (https://www.python.org/dev/peps/pep-0008/)
- **JavaScript:** Create React App (https://www.npmjs.com/package/eslint-config-react-app)
- **HTML:** CodeGuide by Mark Otto (http://codeguide.co/)
- **CSS:** Idiomatic CSS (https://github.com/necolas/idiomatic-css)
### Documenting
- English or spanish accepted
### Tools
- IDE: [Visual Studio Code](https://code.visualstudio.com/)
  - To setup debugger: Download vscode extension "Debugger fo chrome", open the debugger in vscode (bug icon on the left), touch the gear button on the top, select chrome, and change the url to localhost:3000 instead of 8080, and save.
- Console: [cmder](http://cmder.net/)
  - Go to settings (`Win+Alt+p`), startup, tasks, {{cmd:cmder}}, startup dir.. and select your GitHub directory
- Prototyping: [JustInMind](https://www.justinmind.com/)
- UML Modelling: [Enterprise Architect](http://www.sparxsystems.com/products/ea/) 
  - It's recommended to follow this [instructions](https://docs.google.com/document/d/1aiTtPPE9bWLdNnu2MVhimmbW6wWmoZtIJilpCCdZZQQ/edit?usp=sharing)
- Redux dev tools: [ReduxDevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- Reactotron (mejor debug para mobile): [Reactotron](https://github.com/infinitered/reactotron)
  - No config needed for mobile, just install the app
  - If using android emulator and it doesnt connect, try `adb reverse tcp:9090 tcp:9090`
### Git
To know how to:
- Start coding
- Prepare for a Pull Request
- Create, update and delete branches

Go to our [Git wiki](https://github.com/Jumpi96/helpo/wiki/Git-hints)

## Running without Docker
### Prerequisites
- Python 3.6.5: Full install, select "Add to PATH", for all users, including debugging binaries (select all options).
- NodeJS and NPM LTS 8.11.1
- PostgreSQL 10.3.2: Full install, select all options, password=postgres, port=5432, next.
- Create a virtualenv for your helpo-api app. Read [here](https://packaging.python.org/guides/installing-using-pip-and-virtualenv/)
### Setup
- On pgAdmin, open Servers, PostgreSQL 10, right click on Databases and create db with name: `db-helpo`
- On project folder `helpo-api/`:
  - Create file with name `.env` and text from: [API Local ENV Wiki](https://github.com/Jumpi96/helpo/wiki/ENV-Files#local)
  - Run on `helpo-api/` with virtualenv activated: 
```
pip install numpy
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
- On project folder `helpo-web/`:
  - Create file with name `.env` and text from: [Web Local or Docker ENV Wiki](https://github.com/Jumpi96/helpo/wiki/ENV-Files#local-or-docker)
  - Run on `helpo-web/`: 
```
npm update
npm update --save
npm install
npm run start
```

## Running with Docker
### Prerequisites
- Install Docker.
### Setup
- On project folder `helpo-api/`:
  - Create file with name `.env` and text from: [API Docker ENV Wiki](https://github.com/Jumpi96/helpo/wiki/ENV-Files#docker)
- On project folder `helpo-web/`:
  - Create file with name `.env` and text from: [Web Local or Docker ENV Wiki](https://github.com/Jumpi96/helpo/wiki/ENV-Files#local-or-docker)
### Run
- From root: `docker-compose build`
- From root: `docker-compose up`
  - If you need pgAdmin4 go to http://localhost:5050 and create a server with:
    - Name: `postgres`, Host: `db`, Password: `postgres`.
### Migrations and Docker
- We have a problem with our optional use of Docker and migrations. **If you want to create or modify models in Django**, you have to:
  - Do not use Docker to *makemigrations* and *migrate*.
    - Change your .env file and run your DB with `docker-compose up db`.
    - Use *pipenv* to run your environment and run your Django *locally*.
    - Run `python manage.py makemigrations` and `python manage.py migrate` on your shell. 
  - To use Docker again, change your .env file, build your Docker image and run with *docker-compose*.
  
## Testing your deployment
- Open a browser and go to:
    - Helpo-api: `localhost:8000`
    - Helpo-web: `localhost:3000`

## Running helpo-mobile
### Initial Setup
Only the first time:
1. Follow the [Building Projects with Native Code](https://facebook.github.io/react-native/docs/getting-started.html) guide picking your OS
2. Follow the [Ignite CLI Installation](https://github.com/infinitered/ignite#arrow_down-install) guide
3. Remember to [Install Yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable) paying attention to [Ubuntu 16.04 configuration](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
4. Open Android Studio and start an **Android Virtual Device (AVD)**
5. From **_helpo-mobile_** folder, run:
    - `yarn install`
    - `react-native run-android` (or `react-native run-ios` in case you are Lucho)
### Run
Whenever you want to code, after initial setup:
  - Android
    1. Open Android Studio and start an Android Virtual Device (AVD)
    2. From **_helpo-mobile_** folder, run:
        - `npm start`
    3. Tap twice **_R_** inside AVD to reload Helpo app.
### Using local API
- Add your *server* (the IP where the JS bundler is working) IP to `base.py` configuration file. For example, 10.0.2.2.
  - Add to *ALLOWED_HOSTS* (without the port) and *CORS_ORIGIN_WHITELIST* (with its port --> 10.0.2.2:8000).
- Change IP of `api.js` configuration file in helpo-mobile.
### Reinstalling dependencies and packages
- Repeat **Step 5** from *Initial Setup* if mobile dependencies have changed
