<div id="top"></div>

<h1 align="center">DXC-Book-Store-Server-Node.js-Javascript</h1>

<div align="center">
  <p align="center">
    This server-side application is part of the DXC Book Store assingment built with Node.js and Javascript. 
  </p>
    <a href="https://www.postman.com/almog-gutin/workspace/dxc-book-store">View Postman Files</a>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-application">About The Application</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#how-to-install">How To Install</a></li>
    <li><a href="#available-scripts">Available Scripts</a></li>
    <li><a href="#postman">Postman</a></li>
  </ol>
</details>

<!-- ABOUT THE APPLICATION -->

## About The Application

This server-side application is is part of the DXC Book Store assignment.

It is built with Node.js and Express Framework with Javascript. In addition the application's database is MongoDB with the use of an ODM like Mongoose. Additionally the application has basic authentication and authorization functionality with the use of JWT. The application also uses Redis, to store JWT tokens for users and s3 buckets to store Book covers.

In the applicaiton we can add books to the database, edit them and delete them. Users can signup, login, edit, and delete their data. In addition, each user has their own cart, where they can store books they want to buy, and checkout if they wish too.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

-   [Node.js](https://nodejs.org/en/)
-   [Express](https://expressjs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [Mongoose (ODM)](https://mongoosejs.com/)
-   [Redis](https://www.npmjs.com/package//redis)
-   [AWS-SDK](https://www.npmjs.com/package/aws-sdk)
-   [Multer](https://www.npmjs.com/package/multer)
-   [Multer-S3](https://www.npmjs.com/package/multer-s3)
-   [JWT](https://www.npmjs.com/package/jsonwebtoken)
-   [Bcrypt](https://www.npmjs.com/package/bcrypt)
-   [Validator.js](https://www.npmjs.com/package/validator)
-   [Cors](https://www.npmjs.com/package/cors)
-   [Days.js](https://day.js.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- INSTALLATION INSTRUCTIONS -->

## How To Install

**Git clone**

```
git clone https://github.com/almog-gutin/DXC-Book-Store-Node-Javascript.git
```

**Instructions**

-   After cloning the the repository run `npm i` in order to install all the dependencies.
-   Fill in all the values of the env variables in `config/dev.env` file so that the application will run properly during development mode.

<p align="right">(<a href="#top">back to top</a>)</p>

<!--  AVAILABLE SCRIPTS -->

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the production mode.\
However this script is only ment to be run when deploying the application. The application is built, where you need to setup the env variables on the machine that your will be hosting it on or in a webhosting service, unlike in development mode.

### `npm run dev`

Runs the app in the development mode.\
Open localhost on the port you decided on in the env variables to view it in the browser.

The page will reload if you make edits with nodemon.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- POSTMAN -->

## Postman

Above, there is a link that will take you to the postman files in my postman profile where you can test the api functionality in the browser.

However if you would like to run the files locally on your machine in the postman desktop application, included in the repository, in the `postman` directory all the files so you can import them. In addition you will have to configure env variables in postman so that you will be able to test properly everything.

<div align="center">
  <img src="./assets/postman/postman-global-env-variables.png" alt="Postman global env variables."/>
  <img src="./assets/postman/postman-admin-env-variables.png" alt="Postman admin env variables."/>
  <img src="./assets/postman/postman-user-env-variables.png" alt="Postman user env variables."/>
</div>

<p align="right">(<a href="#top">back to top</a>)</p>
