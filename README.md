# Blog App Description

The following is a description of a Blog App built using Express.js. The application utilizes various middleware, database connectivity, and routing to create a functional blog platform.

## Features

- **Express Middleware:**
  - Utilizes popular Express.js middleware such as `cors`, `morgan`, and `method-override` for enhanced functionality and logging.

- **Session Management:**
  - Implements session management with `express-session` and a MongoDB store (`connect-mongo`). This allows for user authentication and persistence.

- **Database Integration:**
  - Connects to a MongoDB database using the `ConnectDB` module, and interacts with the database using the Mongoose ODM. The app has a `Post` model for handling blog posts.

- **EJS Templating Engine:**
  - Sets up the EJS templating engine for rendering dynamic views, enhancing the presentation of blog content.

- **Routing:**
  - Defines routes for users, posts, and comments in separate modules (`usersRoutes`, `postsRoutes`, `commentsRoutes`). API endpoints are prefixed with "/api/v1/".

- **Error Handling:**
  - Implements a custom error handling middleware (`errorHandler`) to manage and respond to errors in a user-friendly manner.

- **Static Files:**
  - Serves static files from the "public" directory, allowing for the inclusion of stylesheets, images, or other assets.

- **Home Route:**
  - Defines a home route ("/") that fetches and displays blog posts along with user and comment information.

- **Local Variables:**
  - Uses `res.locals` to set local variables such as `truncatePost` and `userAuth`, enhancing the availability of these variables in templates.

- **Port Configuration:**
  - Listens on a specified port (either 5000 or the value from the environment variable `PORT`).

## Getting Started

1. Install dependencies using `npm install`.
2. Set up a MongoDB database and configure the connection string in the `.env` file.
3. Run the application using `npm start` or `node app.js`.
