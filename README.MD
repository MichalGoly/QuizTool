# CS39440 Major Project - Quiz Tool
## Outline Project Specification
The draft of the outline project specification is available [here](docs/ops/mwg2_OutlineProjectSpecification.pdf).

## Chris's Project Description
I am looking for an Android based quiz system. The system should allow instructors to
create quizzes online for multiple choice, multiple selection, number ranges, true/false,
yes/no, text answers and perhaps others. During a quiz session the instructor displays (on
his teaching machine) the quiz "slides" which the students will see displayed in sync via
an Android app on their mobile device (smartphone, tablet). Students will see appropriate input
controls on app depending on the kind of slide presented. The answers are submitted with an
indicator on the instructor machine showing the percentage of respondents that have submitted.
The instructor should be able to then display the results as an appropriate bar graph and be able
to store the results in a csv or XML file for later analysis. It should be possible to recreate
the slides with results based on this file.

The system would be server based, and so some kind of session identifier would be required so that
multiple sessions can be run at the same time. Simple authentication would also be useful.

Being able to embed quiz slide material with other HTML material would be useful. Using an existing
editing component to generate the HTML might be a sensible approach.

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
