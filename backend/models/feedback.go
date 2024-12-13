package models

import "time"

// Feedback represents user feedback for books or services.
type Feedback struct {
	ID             int       `json:"id"`             // The feedback's ID (Primary Key)
	UserID         int       `json:"user_id"`        // The ID of the user who gave feedback (Foreign Key to `users`)
	Likes          string    `json:"likes"`          // Text of what the user liked
	Dislikes       string    `json:"dislikes"`       // Text of what the user disliked
	Recommendation bool      `json:"recommendation"` // Whether the user recommends the product or not
	CreatedAt      time.Time `json:"created_at"`     // Timestamp for when the feedback was created
}
