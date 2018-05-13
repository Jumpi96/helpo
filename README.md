# helpo [![CircleCI](https://circleci.com/gh/Jumpi96/helpo.png?circle-token=:circle-token)](https://circleci.com/gh/Jumpi96/helpo.png?circle-token=:circle-token) [![Coverage](https://codecov.io/gh/jumpi96/helpo/branch/master/graph/badge.svg)](https://codecov.io/gh/jumpi96/helpo/branch/master/graph/badge.svg)

> Proyecto Final - UTN FRC - 2018

Created with [Django React Boilerplate](https://github.com/vintasoftware/django-react-boilerplate).

## Conventions
### Coding
- **Python:** PEP 8 (https://www.python.org/dev/peps/pep-0008/)
- **JavaScript:** AirBnb for React (https://github.com/airbnb/javascript/tree/master/react)
- **HTML:** CodeGuide by Mark Otto (http://codeguide.co/)
- **CSS:** Idiomatic CSS (https://github.com/necolas/idiomatic-css)
### Documenting
- English or spanish accepted
### Tools
- IDE: [Visual Studio Code](https://code.visualstudio.com/)
- Console: [cmder](http://cmder.net/)
  - Go to settings (`Win+Alt+p`), startup, tasks, {{cmd:cmder}}, startup dir.. and select your GitHub directory
- Prototyping: [JustInMind](https://www.justinmind.com/)
- UML Modelling: [Enterprise Architect](http://www.sparxsystems.com/products/ea/) 
  - It's recommended to follow this [instructions](https://docs.google.com/document/d/1aiTtPPE9bWLdNnu2MVhimmbW6wWmoZtIJilpCCdZZQQ/edit?usp=sharing)
- Screenshots: [ScreenPresso](https://www.screenpresso.com/)

### Git
- Every time you start coding you should follow this workflow:
```
# Pull everything from all branches
git pull -a
# Check your selected branch
git branch
# Switch to your branch
git checkout your_branch
# Do your work and
git status
git add some_files
git commit -m "What you change"
git push
```
- Before making a Pull Request:
```
# Switch to master branch and pull
git checkout master
git pull
# Switch to your branch and update it
git checkout your_branch
git rebase master
```
- How to create, update and delete branches:
```
# If you want to create and switch to a new branch 
git checkout -b new_branch
# If you want to update your SELECTED branch from master after PULLING 
git rebase master
# If you want to delete your branch
git branch -d your_branch
```
- Useful tips:
```
# Rollback a commit you made on YOUR SELECTED branch
git revert commit_id
# Compare modified file
git diff your_file
# For more info visit:
https://gist.github.com/Chaser324/ce0505fbed06b947d962
```

## Running without Docker
### Prerequisites
- Python 3.6.5: Full install, select "Add to PATH", for all users, including debugging binaries (select all options).
- NodeJS and NPM LTS 8.11.1
- PostgreSQL 10.3.2: Full install, select all options, password=postgres, port=5432, next.
- Run CMD as Administrator and:
```
python -m pip install --upgrade pip
pip install pipenv
```
### Setup
- On pgAdmin, open Servers, PostgreSQL 10, right click on Databases and create db with name: `db-helpo`
- On project folder `helpo-api/`:
  - Create file with name `.env` and text `DJANGO_SETTINGS="helpo.settings.local"`
- Run on `helpo-api/`: 
```
pipenv install --dev
pipenv shell
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
- On projec folder `helpo-web/`:
  - Create file with name `.env` and text `REACT_APP_API_URL="http://localhost:8000"`
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
- From root: `docker-compose build`
- On project folder `helpo-api/`:
  - Create file with name `.env` and text `DJANGO_SETTINGS="helpo.settings.docker"`
### Run
- From root: `docker-compose up`
  - For using pgAdmin4 (http://localhost:5050), *Create Server*.
    - Name: postgres
    - Host name: db
    - Password: postgres
### Migrations and Docker
- We have a problem with our optional use of Docker and migrations. **If you want to create or modify models in Django**, you have to:
  - Do not use Docker to *makemigrations* and *migrate*.
    - Change your .env file and run your DB with `docker-compose up db`.
    - Use *pipenv* to run your environment and run your Django *locally*.
    - Run `python manage.py makemigrations` and `python manage.py migrate` on your shell. 
  - To use Docker again, change your .env file, build your Docker image and run with *docker-compose*.
## Testing your deployment
- Open a browser and go to `localhost:8000`

## Running helpo-mobile
### Prerequisites
- Expo (iOS/Android) in your phone.
### Setup
- Execute: `npm install`
### Run
- Execute: `npm start`
- Scan QR Code with your phone.
### Using local API
- Add your *server* (your PC) IP to `base.py` configuration file.
  - Add to *ALLOWED_HOSTS* and *CORS_ORIGIN_WHITELIST*
- Change IP of `api.js` configuration file in helpo-mobile.
### Solving problems
- Your phone has to be in the same network as your PC. 
  - If it does not work, check if the React Native server IP is the same as the one of your PC in that network (it's possible that React Native choose the wrong one: a Docker, Hyper-V or VirtualBox network).
    - To solve this, set this environment variable:
      - In Windows PowerShell: `$env:REACT_NATIVE_PACKAGER_HOSTNAME = "<your_IP>"`

