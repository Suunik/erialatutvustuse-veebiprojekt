package models

import "time"

// User represents a user in the system.
type User struct {
	ID           int       `json:"id"`            // The user's ID (Primary Key)
	Username     string    `json:"username"`      // The user's username
	PasswordHash string    `json:"password_hash"` // The hashed password for the user
	CreatedAt    time.Time `json:"created_at"`    // Timestamp for when the user was created (optional, if you're tracking creation time)
	Password     string    `json:"password"`      // password
}
