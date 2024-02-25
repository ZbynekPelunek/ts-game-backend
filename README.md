# Typescript Game - Backend

Backend part for a typescript game. The other parts are Frontend and Shared (interfaces).

## Table of contents

- [Typescript Game - Backend](#typescript-game---backend)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Technologies](#technologies)
  - [Features](#features)
  - [Instalation](#instalation)
  - [Status](#status)
  - [Inspiration](#inspiration)

## Overview

A game inspired by Shakes & Fidget. You have a hero, that you send to adventures to get better items to do harder adventures...
This project also contains a lot of commented code for now because at first, I tried to make the game without using database to see if it is even possible using only REST API. It did work as I imaginated so now I am in middle of adding MongoDB database.

## Technologies

* Typescript
* MongoDB
* Node
* Express

## Features

* Account API
* Characters API
  * Attributes API
  * Currencies API
* Items API
  * Equipment API
  * Inventory API

## Instalation

To be able to make it run, you need to
- Have MongoDb running locally on mongodb://127.0.0.1:27017
- Seed the database with seed scripts (seedItems, ...)
- Have Shared folder in the same folder as Backend and Frontend

1. Clone this repository

```bash
git clone https://github.com/zbynekpelunek/ts-game-backend
```

2. Install packages

```bash
npm install
```

3. Start the project with dev script

```bash
npm run dev
```

## Status

Project is: _in progress_

## Inspiration

Shakes & Fidget (main gameplay loop), various RPG games for itemization and combat
