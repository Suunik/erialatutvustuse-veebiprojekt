package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func AddBook(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCustomCORSHeaders(w, "http://localhost:3000", "POST, OPTIONS", "Content-Type, Accept, Content-Length")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Check content type
	contentType := r.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "multipart/form-data") {
		http.Error(w, "Content-Type must be multipart/form-data", http.StatusUnsupportedMediaType)
		return
	}

	// Parse multipart form data with 10MB max memory
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Error parsing form data: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Get book data from form
	var book models.Book
	book.Title = r.FormValue("title")
	book.Description = r.FormValue("description")
	book.Author = r.FormValue("author")
	book.Category = r.FormValue("category")
	book.Price, err = strconv.ParseFloat(r.FormValue("price"), 64)
	if err != nil {
		http.Error(w, "Invalid price", http.StatusBadRequest)
		return
	}

	// Validate and parse user ID
	userIDStr := r.FormValue("userId")
	book.UserID, err = strconv.Atoi(userIDStr)
	if err != nil || book.UserID < 0 {
		// Set default user ID if invalid
		book.UserID = 1
	}

	// Get picture file
	file, _, err := r.FormFile("picture")
	if err != nil && err != http.ErrMissingFile {
		http.Error(w, "Error retrieving picture file", http.StatusBadRequest)
		return
	}

	var base64PictureWithPrefix string
	if file != nil {
		defer file.Close()
		// Read the file into a byte slice
		pictureBytes, err := io.ReadAll(file)
		if err != nil {
			http.Error(w, "Error reading picture file", http.StatusInternalServerError)
			return
		}

		// Convert the byte slice to a Base64 string and add the data URI scheme
		base64Picture := base64.StdEncoding.EncodeToString(pictureBytes)
		base64PictureWithPrefix = "data:image/png;base64," + base64Picture
	}

	// Insert the book into the database
	var bookID int
	err = database.Db.QueryRow(`
		INSERT INTO books (user_id, title, author, description, category, price, pictureURL, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
		RETURNING id
	`, book.UserID, book.Title, book.Author, book.Description, book.Category, book.Price, base64PictureWithPrefix).Scan(&bookID)

	if err != nil {
		http.Error(w, "Error creating book", http.StatusInternalServerError)
		return
	}

	// Send back the ID of the created book
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"book_id": bookID})
}

func GetBooks(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCustomCORSHeaders(w, "http://localhost:3000", "GET", "Content-Type")

	rows, err := database.Db.Query(`
		SELECT b.id, b.title, b.description, b.price, b.created_at, b.category
		FROM books b
		ORDER BY b.created_at DESC
	`)
	if err != nil {
		http.Error(w, "Error fetching books", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var books []map[string]interface{}
	for rows.Next() {
		var (
			id          int
			title       string
			description string
			price       float64
			picture     []byte
			createdAt   time.Time
			category    string
		)

		err := rows.Scan(&id, &title, &description, &price, &picture, &createdAt, &category)
		if err != nil {
			continue
		}

		pictureBase64 := ""
		if len(picture) > 0 {
			pictureBase64 = base64.StdEncoding.EncodeToString(picture)
		}

		book := map[string]interface{}{
			"id":          id,
			"title":       title,
			"description": description,
			"price":       price,
			"picture":     pictureBase64,
			"created_at":  createdAt.Format(time.RFC3339),
			"category":    category,
		}
		books = append(books, book)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}

func GetBooksByTag(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCustomCORSHeaders(w, "http://localhost:3000", "GET", "Content-Type")

	tag := r.URL.Query().Get("tag")
	if tag == "" {
		http.Error(w, "Tag parameter required", http.StatusBadRequest)
		return
	}

	query := `
        SELECT b.id, b.user_id, b.title, b.author, b.description, b.category, b.price, b.pictureurl, b.created_at
        FROM books b
        WHERE (b.title ILIKE $1 OR b.description ILIKE $1 OR b.category ILIKE $1 OR b.author ILIKE $1)
        ORDER BY b.created_at DESC
    `

	rows, err := database.Db.Query(query, "%"+tag+"%")
	if err != nil {
		http.Error(w, "Error scetching books", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var books []models.Book
	for rows.Next() {
		var book models.Book

		err := rows.Scan(&book.ID, &book.UserID, &book.Title, &book.Author, &book.Description, &book.Category, &book.Price, &book.PictureURL, &book.CreatedAt)
		if err != nil {
			http.Error(w, "Error scanning book data", http.StatusInternalServerError)
			return
		}

		books = append(books, book)
	}

	// Check for errors from iteration
	if err = rows.Err(); err != nil {
		http.Error(w, "Error iterating books", http.StatusInternalServerError)
		return
	}

	// Send JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}

func GetBookByID(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCustomCORSHeaders(w, "http://localhost:3000", "GET", "Content-Type")

	bookID := r.URL.Query().Get("id")
	if bookID == "" {
		http.Error(w, "ID parameter required", http.StatusBadRequest)
		return
	}

	query := `
        SELECT b.id, b.user_id, b.title, b.author, b.description, b.category, b.price, b.pictureurl, b.created_at
        FROM books b
        WHERE b.id = $1
    `

	var book models.Book

	row := database.Db.QueryRow(query, bookID)
	err := row.Scan(&book.ID, &book.UserID, &book.Title, &book.Author, &book.Description, &book.Category, &book.Price, &book.PictureURL, &book.CreatedAt)
	if err != nil {
		http.Error(w, "Error fetching book", http.StatusInternalServerError)
		return
	}

	// Send JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(book)
}
