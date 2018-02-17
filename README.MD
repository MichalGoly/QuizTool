# CS39440 Major Project - Quiz Tool
## Outline Project Specification
The draft of the outline project specification is available [here](docs/ops/mwg2_OutlineProjectSpecification.pdf).

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

# Design (draft)
## Server side
- [Node.js Express](https://expressjs.com/) web development framework will be used on the
back end to handle clients' interactions.
- [MongoDB](https://www.mongodb.com/) JSON storage database will be used for data persistance.

## Client side
There will be 2 types of clients:
- **Lecturer**
- **Student**

### Lecturer client side
- [Angular 4](https://angular.io/) will be used to create a web client for the lecturer. It should
allow the lecturer to authenticate with the app and create lecture sessions and broadcast them later on.

### Student client side
There are 3 attainable options:
- Angular 4 to create a website, works both on iOS, Android and beyond, with the advantage of
reusing the same framework for both the lecturer and student clients

## Build
- [CircleCI](https://circleci.com/) will be used to continuosly checkout, build, test and deploy
the system.

## Deployment
- The app will be deployed to Docker container engine on [AWS](https://aws.amazon.com/)

## Environments
There should be at least 3 environments:
- Development
- Testing
- Production

Each environment will have its own database.

## Docker & docker-compose
The server side express app, the lecturer client and the database will need to be containarised using Docker.
These containers will then run under docker-compose container orchestration tool on AWS.

## Development
- Code will be stored on GitHub
- ZenHub will be used as a Kanban board to manage work items and to monitor progress
- Work could be split into multiple iterations
- Code will need to be tested
- New features will be added using a feature-branch working model
- Each issue will have a corresponding feature-branch
- Once the feature is complete, the feature-branch has to be merged into the development branch
by opening a pull request
- Direct push to master/develop will be forbidden
- Each pull request will trigger a CircleCI build agent which will run all tests before allowing
the code to be merged

## Business Logic
- The server side app listens to incoming calls
- The Lecturer client logs in using his credentials, possibly LDAP authentication using
the uni network (we'll see)
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

















.
