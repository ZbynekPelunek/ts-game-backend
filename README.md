# Typescript Game - Backend

Backend part for a typescript game. The other parts are Frontend and Shared (interfaces).

## Table of contents

- [Typescript Game - Backend](#typescript-game---backend)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Technologies](#technologies)
  - [Features](#features)
  - [Installation](#installation)
  - [Status](#status)
  - [Inspiration](#inspiration)

## Overview

A game inspired by Shakes & Fidget. You have a hero, that you send to adventures to get better items to do harder adventures...

## Technologies

- Typescript
- MongoDB
- Node
- Express

## Features

- Account API
- Adventure API
- Attribute API
- Character API
  - CharacterAttribute API
  - CharacterCurrency API
  - CharacterEquipment API
- Currency API
- Inventory API
- Item API
- Result API
- Reward API
- Enemy API

## Installation

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
