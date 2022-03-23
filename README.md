# Welcome to Leave Me Alone's Server

This is the **server** that provides a **REST API** for **mobile app**, and **MQTT** to work with all the **IoT** you can find in the front of your door. It will also make a **relation** between them.


## Prerequisites

You need an MQTT broker running, a mongoDB database and a wifi spot.

## Before starting

Create a file called `.env` and write inside them the environment variables that are needed.

Example :
`
SERVER_PORT=3000 // The port you want this app to run on (default 80)
MQTT_BROKER_URL="http://localhost:1883" // The URL of your MQTT Broker (required)
MONGODB_URL="mongodb://localhost:27017/leavemealone" // The URL of your mongoDB database (required)
ACCESS_TOKEN_SECRET=GD8Z7A9GD8326D307 // A random complex string to provide a key for JWT tokens creation
`

## Start

**Very easy :**
Run `npm i` to install all packages.
Run `npm start` to run the application.

## Rest API Contract (docs)

Once you started the application you can find the contract at this url : http://{IP}:{port}/leavemealone/docs

example : 127.0.0.1:3000/leavemealone/docs