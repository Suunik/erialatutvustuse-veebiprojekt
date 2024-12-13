package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	_ "github.com/lib/pq" // Import the PostgreSQL driver
)

func AddFeedback(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCustomCORSHeaders(w, "http://localhost:3000", "POST, OPTIONS", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Declare a variable of type Feedback
	var feedback models.Feedback

	if err := json.NewDecoder(r.Body).Decode(&feedback); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// If UserID is 0, set it to NULL in the database
	var userID interface{}
	if feedback.UserID == 0 {
		userID = nil
	} else {
		userID = feedback.UserID
	}

	_, err := database.Db.Exec(`
		INSERT INTO feedback (user_id, likes, dislikes, recommendation)
		VALUES ($1, $2, $3, $4)
	`, userID, feedback.Likes, feedback.Dislikes, feedback.Recommendation)

	if err != nil {
		http.Error(w, "Error adding feedback", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func GetFeedback(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCustomCORSHeaders(w, "http://localhost:3000", "GET", "Content-Type")

	rows, err := database.Db.Query(`
		SELECT f.id, f.likes, f.dislikes, f.recommendation, f.created_at, u.username
		FROM feedback f
		LEFT JOIN users u ON f.user_id = u.id
		ORDER BY f.created_at DESC
	`)
	if err != nil {
		http.Error(w, "Error fetching feedback", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var feedbacks []map[string]interface{}
	for rows.Next() {
		var (
			id             int
			likes          string
			dislikes       string
			recommendation bool
			createdAt      time.Time
			username       sql.NullString
		)

		err := rows.Scan(&id, &likes, &dislikes, &recommendation, &createdAt, &username)
		if err != nil {
			continue
		}

		feedback := map[string]interface{}{
			"id":             id,
			"likes":          likes,
			"dislikes":       dislikes,
			"recommendation": recommendation,
			"created_at":     createdAt.Format(time.RFC3339),
			"username":       username.String,
		}
		feedbacks = append(feedbacks, feedback)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedbacks)
}
