Student-Portal-Let

This is a Next.js project bootstrapped with create-next-app.

========================================
🚀 Getting Started
==================

Follow the steps below to set up and run the project on your local machine.

Prerequisites:

- Node.js
    ```
    https://nodejs.org/en/download
    ```
- XAMPP MySQL
    ```
    https://www.apachefriends.org/download.html
    ```
- Visual Studio Code
    ```
    https://code.visualstudio.com/download
    ```

---

## Setup Instructions

1️⃣ Install the prerequisites listed above.

2️⃣ Import the `Letran.sql` database file into MySQL.

3️⃣ Install necessary packages:
   ```bash
   npm install mysql2 node-schedule
   ```

4️⃣ Create a `.env` file in the root directory and add the following content:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=Letran
   DB_PORT=3308
   NEXT_PUBLIC_HOME_URL=http://localhost:3000/
   ```

5️⃣ Initialize the project:
   ```bash
   npm init
   ```

6️⃣ Start the development server:
   ```bash
   npm run dev
   ```

Once started, open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

