# techinnover-E-commerce
An E-commerce backend API built with node js and nest js.

## Description

This project is a simple e-commerce system that allows unauthenticated users to view approved products, authenticated users to manage their products, and an admin to manage users and products.


## Installation

### Pull From This Repo

```bash
https://github.com/Richeskelechi/techinnover-E-commerce.git
```

### Create .env file in the root director and the following to it

```bash

DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

JWT_SECRET=
JWT_EXPIRY=

PORT=

```
The above are the envs that will allow our application to run currently. Ensure you have the database creatd.
please copy and paste the keys in you just created .env file and fill in the values. 
A sample of the env file has be created and called .env.example

## Running the app

### Firstly, we need to Install All packages. 
I have added the script in our package.json file.

```bash
yarn
```

### Secondly, we need to build the App. 

```bash
yarn build
```

### Lastly, we need to run the migration to have our schemas up. 

```bash
yarn migration:run
```
## Now let us start the App.

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## You can also view the documentation from the url below. Please Note that if you are using a different port please change the port to the one your app is listening to

```bash
http://localhost:3000/docs
```

# Happy Coding.
