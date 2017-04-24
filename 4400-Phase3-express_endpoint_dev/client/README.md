# client

A client for accessing the group 17 SLS (Service, Learn, Sustain) api and the front end for users.

## Installing

You need ruby and the ruby gems 'sass' and 'compass'.  After installing ruby, install them with the commands
> gem install sass

> gem install ruby

Next, npm requires a few packages in order to build and run the application.  Use this to install them globally
>npm install -g grunt-cli bower

## Build & development

Run `grunt serve` for preview.  The API will be proxied to localhost:3000 so make sure expressjs is running if you intend to make API calls.

If you need to build for whatever reason, use `grunt build` which will build the `/client` directory into `/server/dist`, after which express will serve the app at `http://localhost:3000`.

