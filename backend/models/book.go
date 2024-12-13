package models

import "time"

// Book represents a book in the system.
type Book struct {
	ID          int       `json:"id"`          // The book's ID (Primary Key)
	UserID      int       `json:"user_id"`     // The ID of the user associated with the book
	Title       string    `json:"title"`       // The title of the book
	Author      string    `json:"author"`      // The author of the book
	Description string    `json:"description"` // A description of the book
	Category    string    `json:"category"`    // Book category
	Price       float64   `json:"price"`       // The price of the book
	PictureURL  string    `json:"picture_url"` // URL for the book's picture
	CreatedAt   time.Time `json:"created_at"`  // Timestamp of when the book was created
}
