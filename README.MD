# CS39440 Major Project - Quiz Tool
Build status: [![CircleCI](https://circleci.com/gh/MichalGoly/FinalProject/tree/master.svg?style=svg&circle-token=7595e3f66df7f118a3566b0a64f1772a631be0d5)](https://circleci.com/gh/MichalGoly/FinalProject/tree/master)
## Outline Project Specification
The draft of the outline project specification is available [here](docs/ops/mwg2_OutlineProjectSpecification.pdf).

## Production environment
The production environment can be accessed [here](http://prod-env.3nhfpmarra.eu-west-2.elasticbeanstalk.com/).

## Timesheet
[Google sheets timesheet](https://docs.google.com/spreadsheets/d/1V1cxn0A4oLpygT2_huqFQaV2wz1W9XVqJLWeiHpg0qw/edit?usp=sharing)

## Project Description
Student engagement and live knowledge monitoring are vital in the provision of good quality
lecture content in 2018. It is important to make sure audience understands concepts presented,
and quizzes can help lecturers judge students' understanding in real time.

Aberystwyth University currently uses Qwizdom live polling tool during the provision
of some lectures and practical sessions. The university operates under a single license
forcing lecturers to book sessions before they can use the tool. Due to human nature,
session hijacking occasionally occurs to the bemusement of both students and lecturers.
For example, students could be shown biology slides half way through their geography
lecture.

This project will focus on the design and development of an in-house built Quiz Tool,
enabling multiple lecturers to use it at the same time and potentially making Qwizdom
redundant in the future. This ambition can only be achieved if the project is of
high quality and its future maintainability is considered at all stages of the design
and development.

The Quiz Tool will allow lecturers to login with their university credentials and
they will be authenticated using the university LDAP. Lecturers will then
be able to upload their PDF lecture slides and create *Lectures* in the system.
Each *Lecture* can be then edited and quizzes can be added between slides.
An example of a quiz would be an "ABC style" question where a student can select
one of the options and submit their answer. Once a lecturer is happy with their
*Lecture*, he can broadcast it and receive a session key which can be
shared with students. Lecture slides will be shown to all students and the
lecture can be delivered in a traditional fashion up to the moment a quiz
has been embedded between two slides. Students will then be able to answer
the question and polling results will be presented in real time to the lecturer.
It will be also possible to export the quiz answers as JSON for future analysis.

The tool will be composed of the back-end with an associated database, and two
front-ends. One for lecturers and one for students. Finally, the tool will be
developed using an agile methodology, adjusted for a single person project.

# Design
## Server side
- [Node.js Express](https://expressjs.com/) web development framework will be used on the
back end to handle clients' interactions.
- [MongoDB](https://www.mongodb.com/) JSON storage database will be used for data persistance.
- [Socket.io](https://socket.io/) will be used to push lecture slides to students.

## Users
There will be 2 types of users:
- **Lecturers**
- **Students**

## Client side
- [Angular 4](https://angular.io/) will be used to create a web client for both lecturers and students. It should
allow the lecturer to authenticate with the app and create lecture sessions and broadcast them later on. Students
can then join the session using the session key provided by a lecturer and view lecture slides on their machines.

## Build
- [CircleCI](https://circleci.com/) will be used to continuosly checkout, build, test and deploy
the system. Build definition is straightforward to follow and can be found in the `.circleci/config.yml` file.
When a `master` branch is built, the extra deployment step is run and you can find out more about it below.

## Deployment
The build agent will only deploy the Quiz Tool to production when the `master` branch is built. The `scripts/deploy.sh`
bash script will run, which consists of two main steps:
- Both client and server Docker containers are tagged for [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/)
purposes, and then pushed to ECR.
- The `eb-cli` [Elastic Beanstalk Command Line Interface](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)
is used to deploy the app to a [Multicontainer Docker Environment](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker_ecs.html).
Elastic Beanstalk pulls the client and the server Docker images from ECR and creates a cluster running in production.
You can find out more by reading the `Dockerrun.aws.json` file.

## Environments
There are 3 environments:
- **Development**: the app running on developer's laptop using `docker-compose`
- **Testing**: the app running tests either on developer's laptop or the build engine provisioned by CircleCI.
- **Production**: the app running in the Elastic Beanstalk Multicontainer Docker Environment.

Each environment should have its own database.

## Docker & docker-compose
Both client and server apps are containerised using Docker. There is also the third mongo db container pulled
straight from the Dockerhub. The client container consists of the angular 4 front-end, and an nginx
reverse proxy and you can find out more by reading the `client/Dockerfile` file. The server on the other hand
consists of a Node.js application with Express.js installed. You can find out more by reading the `server/Dockerfile`
file.

Docker-compose is used to orchestrate these containers for development and testing purposes. The network is defined
in the `docker-compose.yml` file, and a visual representation is available in the `docs/design/app_structure.jpg` file.

## Development
- Code will be stored on GitHub
- ZenHub will be used as a Kanban board to manage work items and to monitor progress
- Work could be split into multiple iterations
- Code will need to be tested
- New features will be added using a feature-branch working model
- Each issue will have a corresponding feature-branch
- Once the feature is complete, the `feature-branch` has to be merged into the `master` branch
by opening a pull request
- Direct push to `master` will be forbidden
- Each pull request will trigger a CircleCI build agent which will run all tests before allowing
the code to be merged

## Business Logic
- The server side app listens to incoming calls
- The Lecturer client logs in using his Google account.
- Lectuer presented with a clean interface enabling him to upload PDF slides
- This creates a new *Lecture* in the system
- Multiple lectures can exist
- Lecturer can open a lecture and add quiz questions between slides as necessary
- Lecturer can then start the lecture by clicking "broadcast"
- Lecturer presented with a session code which he can share with the class
- Each student uses the session key to access the lecture
- Ideally, multiple lecturers can run multiple sessions at the same times
- The responses can be viewed in real time by *Lecturer* and showed to students once
the polling is complete
- The results can be then exported as JSON for later analysis/persistence

Low fidelity prototypes are available in files `docs/design/story_board_lecturer.jpg` and
`docs/design/story_board_client.jpg`.

















.
