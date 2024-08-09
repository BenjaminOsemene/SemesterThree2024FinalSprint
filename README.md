# SemesterThree2024FinalSprint
This project involves building a secure search engine using Node.js, PostgreSQL, and MongoDB. Which allows users to search through data stored in both databases. Users can choose their preferred data source—PostgreSQL, MongoDB, or both—before executing their search queries.

The features of this application includes:
Users must sign up and log in to perform searches.
Users can search data from either PostgreSQL, MongoDB, or both.
All search queries are logged with timestamps and user IDs for security.
Web interface is user-friendly and visually appealing with CSS styling.

The following Technologies are being used:
Node.js: Backend framework for building the server.
Express: Web application framework for Node.js to handle routing.
EJS: Templating engine for rendering HTML pages.
PostgreSQL: Relational database for structured data storage.
MongoDB: NoSQL database for flexible data storage.


TO set up this application you can Clone the Repository and install the required dependencies.

To set up PostgreSQL Database:Create a PostgreSQL database and tables using the provided SQL scripts.

To set up MongoDB Database:Create a MongoDB database and collections. Then
insert provided data using JSON format.

Also, create a .env file in the root directory to store your database connection strings and other confidential configuration variables.

To run the Application use:
node server.js

Open your browser and navigate to http://localhost:3000.

Users must create an account or log in to access the search functionality.
Enter a search term in the search bar and select the desired data source(s) before submitting the query.
Search results will be displayed.
All search queries are logged in the database with a timestamp and user ID to track user interactions and improve security.

License
This project is licensed under the MIT License. This README provides a clear and concise overview of the secure search engine project, making it easy for users and contributors to understand its purpose, setup, and usage.
