# Library Project Management System

A Library Project Management System built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This system is designed to efficiently manage library operations such as managing books, authors, users, and borrowing history.

## Features
- **User Authentication:** Register, login, and role-based access (Admin, Librarian, Member).
- **Book Management:** Add, update, delete, and search books.
- **Author Management:** Manage authors linked to books.
- **Borrowing History:** Track books borrowed by users, including borrow and return dates.
- **Search and Pagination:** Search books by title or author, with paginated results.

## Project Structure

```plaintext
├── backend/
│   ├── models/
│   │   ├── Author.js
│   │   ├── Book.js
│   │   ├── History.js
│   │   ├── User.js
│   │
│   ├── controllers/
│   │   ├── authorController.js
│   │   ├── bookController.js
│   │   ├── historyController.js
│   │   ├── userController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authorRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── historyRoutes.js
│   │   ├── userRoutes.js
│   │
│   ├── config/
│   │   ├── db.js
│   │
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   ├── README.md

```



## Getting Started

Follow these steps to set up the Library Project Management System on your local machine:

### Prerequisites

Ensure you have the following installed on your system:
1. **Node.js**: [Download and install Node.js](https://nodejs.org/)
2. **MongoDB**: [Download and install MongoDB](https://www.mongodb.com/) or use a cloud MongoDB service like [MongoDB Atlas](https://www.mongodb.com/atlas/database).

---

## Installation

1. **Clone the Repository**  
   Open a terminal and run:
```bash
   git clone <repository-url>
   cd project
```

2. **Install Dependencies**
    Install all required dependencies using npm:
```bash
    npm install
 ```
3. **Set Up Environment Variables**
    Create a .env file at the root of the project and configure it with the following keys:
```bash
    MONGO_URI=<your_mongodb_connection_string>
    PORT=5000
 ```
- Replace <your_mongodb_connection_string> with your MongoDB URI. If using a local MongoDB instance, it might look like:
```bash
  MONGO_URI=mongodb://localhost:27017/libraryDB
```
4. **Start server**
```bash
    npm run dev
 ```


# Database Schema

```{
  "Author": {
    "name": "String",
    "bio": "String",
    "createdAt": "Date",
    "books": ["ObjectId (references Book collection)"]
  },
  "Book": {
    "title": "String",
    "author": "ObjectId (references Author collection)",
    "genre": "String",
    "publicationYear": "Number",
    "copiesAvailable": "Number",
    "ISBN": "String"
  },
  "BorrowingHistory": {
    "user": "ObjectId (references User collection)",
    "book": "ObjectId (references Book collection)",
    "borrowedAt": "Date",
    "returnedAt": "Date",
    "finePaid": "Number"
  },
  "User": {
    "name": "String",
    "email": "String",
    "password": "String",
    "role": "String (enum: ['admin', 'librarian', 'member'])",
    "borrowedBooks": ["ObjectId (references Book collection)"]
  }
}
```
### 1. **Author**  
- Stores information about authors.  
- Books reference the `Author` collection.  

### 2. **Book**  
- Contains details about each book.  
- Each book references an `Author` and can have multiple borrow records over time.  

### 3. **User**  
- Stores user information, including roles such as Admin, Librarian, and Member.  
- Users can borrow books, and their borrowing activity is stored in a separate `BorrowingHistory` collection.  

### 4. **BorrowingHistory**  
- Tracks the borrowing activities of users, including:  
  - The book borrowed.  
  - The user who borrowed it.  
  - Borrow and return dates.  
  - Fines, if applicable.  

This design ensures a clear separation of concerns, enabling:  
- Easy management of relationships between books, authors, and users.  
- Robust tracking of borrowing activities.  
- Scalability for future features, such as fine calculations or enhanced borrowing analytics.  

---

### Design Choices
- MongoDB was chosen for its flexibility in handling relationships between collections and ease of scalability.
- Mongoose was used as the ODM (Object Data Modeling) library for schema enforcement and validation.

### Database Relationships
- **Author ↔ Book**: One-to-Many relationship. Each `Author` can have multiple `Book`s, but each `Book` references only one `Author`.
- **User ↔ BorrowingHistory**: One-to-Many relationship. Each `User` can have multiple borrowing records in `BorrowingHistory`.

### API Implementation
- **Add New Author**
  - **Method**: `POST`
  - **Endpoint**: `/api/authors/add`
  - **Response**:
  ```json
    {
        "name": "J.K. Rowling",
        "bio": "J.K. Rowling is a British author best  known for  writing the Harry Potter series, which  has captivated readers worldwide."
    }
  ```

- **Get Author By Id**
  - **Method**: `GET`
  - **Endpoint**: `/api/authors/:id`
  - **Request Body**:
    ```bash
    http://localhost:5000/api/authors/677bfadbcef3d71a1a99da44
    ```
  - **Response**:
    ```json
    {
      "_id": "677bfadbcef3d71a1a99da44",
      "name": "Harper Lee",
      "bio": "American author best known for 'To Kill a Mockingbird'.",
      "createdAt": "2025-01-06T15:46:35.446Z",
      "__v": 2,
      "books": [
      "677d527c34ac1b777a7d5f61",
      "677d52ae34ac1b777a7d5f65"
      ]
    }
    ```
- **Get AuthorDetails By Id**
  - **Method**: `GET`
  - **Endpoint**: `/api/authors/:id`
  - **Request Body**:
    ```bash
    http://localhost:5000/api/authors/authorDetail/677bfadbcef3d71a1a99da44
    ```
  - **Response**:
    ```json
      {
        "name": "Harper Lee",
        "bio": "American author best known for 'To Kill a   Mockingbird'.",
        "booksCount": 2,
        "books": [
      {
        "_id": "677d527c34ac1b777a7d5f61",
        "title": "1984",
        "author": "677bfadbcef3d71a1a99da44",
        "genre": "Dystopian",
        "publicationYear": 1949,
        "copiesAvailable": 8,
        "ISBN": "978-0451524935",
        "__v": 0
      },
      {
        "_id": "677d52ae34ac1b777a7d5f65",
        "title": "Far Away",
        "author": "677bfadbcef3d71a1a99da44",
        "genre": "Romance",
        "publicationYear": 1950,
        "copiesAvailable": 4,
        "ISBN": "978-0351524937",
        "__v": 0
    } ]
    }

---
- **Register User**
  - **Method**: `POST`
  - **Endpoint**: `/api/auth/register`
  - **Request Body**:
    ```json
        {
          "name":"test",
          "email":"test@gmail.com",
          "password":"test11"
        }
    ```

- **Login User**
  - **Method**: `POST`
  - **Endpoint**: `/api/auth/Login`
  - **Request Body**:
    ```json
        {
          "email":"test@gmail.com",
          "password":"test11"
        }
    ```
---

- **Create Book**
  - **Method**: `POST`
  - **Endpoint**: `/api/books/create`
  - **Request Body**:
    ```json
        {
          "title": "The Hobbit",
          "author": "677d543834ac1b777a7d5f74",
          "genre": "Fantasy",
          "publicationYear": 1937,
          "copiesAvailable": 9,
          "ISBN": "9780547928227"
        }
    ```

- **Delete Book**
  - **Method**: `DELETE`
  - **Endpoint**: `/api/books/delete/:id`
  - **Request Body**:
    ```bash
    http://localhost:5000/api/books/delete/677cf9db87866d1cdcde20e9
    ```

- **Borrow Book**
  - **Method**: `POST`
  - **Endpoint**: `/api/books/borrow`
  - **Request Body**:
    ```json
    {
        "bookId": "677d52ae34ac1b777a7d5f65"
    }
    ```

- **Return Book**
  - **Method**: `GET`
  - **Endpoint**: `/api/books/returned-book`
  - **Request Body**:
    ```json
    {
        "bookId": "677d52ae34ac1b777a7d5f65"
    }
    ```

- **Search Book by Title and Author Name**
  - **Method**: `GET`
  - **Endpoint**: `/api/books/q=Title_or_Author`
  - **Request Body**:
    ```bash
      http://localhost:5000/api/books/search?q=AuthororTitle
    ```
---
- **Borrowing History**
  - **Method**: `GET`
  - **Endpoint**: `/api/history/:id`
  - **Request Body**:
    ```bash
      http://localhost:5000/api/history/677c00057b2fa396de8ca046
    ```

    
    







