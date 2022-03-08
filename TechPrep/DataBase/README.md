# Node and Mongo

This weeks lab will deal with linking both the Mongo database and Express application. We will build it in steps so that you can follow along till you have the basic template and then you can fill out the rest of the functionality yourself.

You can do this entire lab on your local machine if you have mongo server installed. Otherwise you just need to have a mongo server that you can connect to to finish this lab.


## Quickstart

1. Put this directory on Ukko.d.umn.edu

2. ``pwd`` to find the path

3. Run ```mongod -f mongod.conf```


## Common Errors

### My mongodb doesn't hand and goes to a prompt

Look for the file called mongod.log. At the end of this file will be the error that is causing it not to run. 

### EADDRINUSE

This means the port number is not available. Retry with a different port number

## Run test program

Note Included is a python test script. It will verify that your endpoints are working correctly. In order to run it make sure you have Mongo running and your Node server running as well. All you need to do to run it is execute : 

```python
python3.5 test.py -p <PORT> -n <NAME> -uid <USERNAME>
```

## MongoDB setup

- Login to ukko with your username

- - Note: You will need to ssh in via Putty, Linux command line, Cygwin, etc.

- Create the directory for your lab, you can name it whatever you want

- Since you will be running everything remotely you will need to create a local mongo instance. 

- - You will need to use a terminal multiplexer otherwise you will be locked out of running any commands. You can use either tmux or screen

  - Tmux and screen allow you to have multiple tabs open which allows you to have a service running in one of them, in this case it will be mongod

  - <http://man7.org/linux/man-pages/man1/tmux.1.html>

  - <https://ss64.com/bash/screen.html>

  - If using tmux

  - - Basic usage:

    - - Create Tab: \<ctrl-b\> + c

      - Switch Tab: \<ctrl-b\> + #

      - - Tabs have numbers to identify them at bottom of screen

      - Detach and leave tmux running: \<ctrl-b\> + d

      - Delete Tab: \<ctrl-b\> + x

- Since ukko has a mongo service running in the background we have to create a mongo configuration file to use.

- - <https://docs.mongodb.com/manual/reference/configuration-options/>
  - Create a file in the same directory titled mongod.conf

```mongo
systemLog:
   destination: file
   path: "./mongod.log"
   logAppend: true
storage:
   dbPath : "./mongo"
   journal:
      enabled: true
net:
   bindIp: 0.0.0.0
   port: 12113
setParameter:
   enableLocalhostAuthBypass: false

```

- **Now to start mongo run:** : ``` mongod --config mongod.conf ```

- - *** Create the mongo directory specified in your dbPath above *** 
  - Your terminal tab will be unresponsive but your database will be up and running