# 4400-Phase3
Phase 3 for Group 17.  This is a nodejs application using express on the backend and an undetermined frontend (TBD).

## Setup
First, you will need nodejs from https://nodejs.org/en/download/ and git from https://git-scm.com/ if on windows, and as "git" on your package manager for *nix systems

Afterwards, use
  >git clone https://github.gatech.edu/mclayton34/4400-Phase3.git
to download the repo.

Now you need to install the packages listed in the package.json dependencies.
First CD into the new directory
  >cd 4400-Phase3
  
then use npm to install all of the required frameworks and extensions.  Use this command to do it in one line:
  >npm i body-parser cookie-parser debug express node-mysql jade morgan serve-favicon node-sass-middleware
  
Now you're all set up.
  
## Running the application
Whenever developing, the application needs to be run in debug mode in order for stack traces and error messages to show up.  In order to do this, we need to set environment variables which is different on Windows and *nix systems.

For windows, use the following
  >set DEBUG=4400-phase3:*
  npm start
  
For *nix, use the following
  >export DEBUG=4400-phase3:*
  npm start
