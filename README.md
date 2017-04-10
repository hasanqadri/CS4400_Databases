# 4400-Phase3
Phase 3 for Group 17.  This is a nodejs application using express on the backend and an undetermined frontend (TBD).

## Application Setup
First, you will need nodejs from https://nodejs.org/en/download/ and git from https://git-scm.com/ if on windows, and as "git" on your package manager for *nix systems

Afterwards, use
  >git clone https://github.gatech.edu/mclayton34/4400-Phase3.git

to download the repo.

Now you need to install the packages listed in the package.json dependencies.
First cd into the new directory
  >cd 4400-Phase3
  
then use npm to install all of the required frameworks and extensions.  Use this command to do it in one line:
  >npm i body-parser cookie-parser debug express mysql jade morgan serve-favicon node-sass-middleware loglevel mocha
  
Now you're done and can run the application.  You need either setup MySQL or set the environment variables DB_HOST, DB_USER, DB_PASS to a valid MySQL installation.

## MySQL Setup (*nix only)
Using your package manager, install mysql-server and start the service.  You can set your root password to anything.

Set whatever you have your password as a var using
 >export rootpasswd=\<your password here\>

Next, run the following commands in order
 >mysql -uroot -p${rootpasswd} -e "CREATE DATABASE SLS017 /*\\!40100 DEFAULT CHARACTER SET utf8 */;"
 >
 >mysql -uroot -p${rootpasswd} -e "CREATE USER SLS017@localhost IDENTIFIED BY 'GROUP17_SPR17';"
 >
 >mysql -uroot -p${rootpasswd} -e "GRANT ALL PRIVILEGES ON SLS017.* TO 'SLS017'@'localhost';"
 >
 >mysql -uroot -p${rootpasswd} -e "FLUSH PRIVILEGES";
 
 To populate the database, cd to the project directory and run
 >node bin/setup
 
 To enable running tests on the database, these commands must also be run
 >mysql -uroot -p${rootpasswd} -e "CREATE DATABASE SLS017_TEST_ENV /*\\!40100 DEFAULT CHARACTER SET utf8 */;"
 >
 >mysqldump -uroot -p${rootpasswd} SLS017 | mysql -uroot -p${rootpasswd} SLS017_TEST_ENV;
 >
 >mysql -uroot -p${rootpasswd} -e "CREATE USER SLS017_TEST@localhost IDENTIFIED BY 'TEST';"
 >
 >mysql -uroot -p${rootpasswd} -e "GRANT ALL PRIVILEGES ON SLS017_TEST_ENV.* TO 'SLS017_TEST'@'localhost';"
 >
 >mysql -uroot -p${rootpasswd} -e "FLUSH PRIVILEGES";

  
## Running the application
Whenever developing, the application needs to be run in debug mode in order for stack traces and error messages to show up.  In order to do this, we need to set environment variables which is different on Windows and *nix systems.

For windows, use the following
  >set DEBUG=4400-phase3:*
  >
  >node --use_strict bin\\www
  
For *nix, use the following
  >export DEBUG=4400-phase3:*
  >
  >node --use_strict bin/www
