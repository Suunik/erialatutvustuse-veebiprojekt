package database

import (
	"backend/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"golang.org/x/crypto/bcrypt"
)

var Db *sql.DB

var userTableCreation = `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    );`

var booksTableCreation = `CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) NULL,
        title VARCHAR(255) NOT NULL,
		author VARCHAR(255) NOT NULL,
        description TEXT,
		category TEXT,
        price DECIMAL(10, 2),
		pictureURL TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
var feedbackTableCreation = `CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) NULL,
        likes TEXT,
        dislikes TEXT,
        recommendation BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

func CreateTables() {
	createTableSQL("users")
	createTableSQL("books")
	createTableSQL("feedback")
}

func GetSqlErrNoRows() error {
	return sql.ErrNoRows
}

func ConnectToDatabase() {
	// Use environment variables from docker-compose
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=postgres sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"))

	var err error
	Db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Test database connection
	err = Db.Ping()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
}

func QueryDatabase(query string) (*sql.Rows, error) {
	return Db.Query(query)
}

func tableExists(tablename string) (bool, error) {
	// Check if tables already exist
	var exists bool
	query := "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)"
	err := Db.QueryRow(query, tablename).Scan(&exists)

	if err != nil {
		log.Printf("Error checking if table exists: %v", err)
		return false, err
	}

	if exists {
		log.Println("Table exists, skipping creation")
		return true, nil
	}
	log.Println("Table does not exist")
	return false, nil
}

func createTableSQL(tablename string) {
	exists, err := tableExists(tablename)

	if err != nil {
		log.Fatalf("Error checking if table exists: %v", err)
	}

	if !exists {
		var err error

		if tablename == "users" {
			_, err = Db.Exec(userTableCreation)
		} else if tablename == "books" {
			_, err = Db.Exec(booksTableCreation)
		} else if tablename == "feedback" {
			_, err = Db.Exec(feedbackTableCreation)
		}

		if err != nil {
			log.Fatalf("Error creating %s table: %v", tablename, err)
		} else {
			log.Printf("%s table created successfully", tablename)
		}
	} else {
		log.Printf("%s table already exists, skipping creation", tablename)
	}
}

func CreateDefaultUser(id int, username string, password string) {
	var exists bool
	query := "SELECT EXISTS (SELECT FROM users WHERE id = $1)"
	err := Db.QueryRow(query, id).Scan(&exists)

	if err != nil {
		log.Printf("Error checking if default admin user exists: %v", err)
		return
	}

	if !exists {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Error hashing default admin password: %v", err)
		}

		_, err = Db.Exec(`INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3)`, id, username, string(hashedPassword))
		if err != nil {
			log.Fatalf("Error creating default admin user: %v", err)
		} else {
			log.Println("Default admin user created successfully")
		}
	} else {
		log.Println("Default admin user already exists, skipping creation")
	}
}

func insertBookIntoDatabase(book models.Book) error {
	query := `INSERT INTO books (user_id, title, author, description, category, price, pictureURL, created_at) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	_, err := Db.Exec(query, book.UserID, book.Title, book.Author, book.Description,
		book.Category, book.Price, book.PictureURL, book.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert book: %v", err)
	}
	return nil
}
func insertUserIntoDatabase(user models.User) error {
	query := `
		INSERT INTO users (ID, username, password_hash)
		VALUES ($1, $2, $3)
	`
	// Insert user into database
	_, err := Db.Exec(query, user.ID, user.Username, string(user.PasswordHash))
	if err != nil {
		return fmt.Errorf("failed to insert user: %v", err)
	}
	return nil
}
func loadBooksFromJSON(filePath string) (map[string][]models.Book, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %v", err)
	}

	books := make(map[string][]models.Book)
	err = json.Unmarshal(data, &books)
	if err == nil {
		return books, nil
	}
	return nil, err
}

func FillBooksTable(folderPath string) {
	tableIsEmpty := booksTableisEmpty()
	if !tableIsEmpty {
		return
	}

	basePath, err := os.Getwd()

	if err != nil {
		log.Fatalf("Error getting basePath value")
	}

	path := filepath.Join(basePath, folderPath)

	files, err := os.ReadDir(path)

	if err != nil {
		log.Fatalf("Error reading folder: %v", err)
	}

	for _, file := range files {
		filePath := filepath.Join(path, file.Name())

		// Load books from JSON file
		books, err := loadBooksFromJSON(filePath)
		if err != nil {
			log.Fatalf("Error loading books from JSON: %v", err)
		}

		for key, bookList := range books {
			log.Print("key is: " + key)
			for i := 0; i < len(bookList); i++ {

				var book models.Book
				book = bookList[i]

				err := insertBookIntoDatabase(book)
				if err != nil {
					log.Printf("Failed to insert book: %v", err)
				} else {
					log.Printf("Successfully inserted book: %s", book.Title)
				}

			}
		}

	}

}

func booksTableisEmpty() bool {
	query := `SELECT COUNT(1) FROM books`
	var count int
	err := Db.QueryRow(query).Scan(&count)
	if err != nil {
		return false
	}
	return count == 0
}
