package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"encoding/json"
	"net/http"
	"strings"
	"unicode"

	"github.com/gorilla/sessions"
	_ "github.com/lib/pq" // Import the PostgreSQL driver
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	// Set CORS headers
	utils.SetCustomCORSHeaders(w, "http://localhost:3000", "POST, OPTIONS", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Declare a variable of type User
	var user models.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Vigased andmed", http.StatusBadRequest)
		return
	}

	// Validate password
	if len(user.Password) < 8 {
		http.Error(w, "Parool peab olema vähemalt 8 tähemärki pikk", http.StatusBadRequest)
		return
	}

	var (
		hasUpper   bool
		hasLower   bool
		hasNumber  bool
		hasSpecial bool
	)

	for _, char := range user.Password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	if !hasUpper || !hasLower || !hasNumber || !hasSpecial {
		http.Error(w, "Parool peab sisaldama vähemalt ühte suurtähte, väiketähte, numbrit ja erimärki", http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Viga parooli krüpteerimisel", http.StatusInternalServerError)
		return
	}

	// Insert user into database and get the ID
	var userID int
	err = database.Db.QueryRow(`
		INSERT INTO users (username, password_hash)
		VALUES ($1, $2)
		RETURNING id
	`, user.Username, string(hashedPassword)).Scan(&userID)

	if err != nil {
		if strings.Contains(err.Error(), "unique constraint") {
			http.Error(w, "Kasutajanimi on juba kasutusel", http.StatusConflict)
			return
		}
		http.Error(w, "Viga kasutaja loomisel", http.StatusInternalServerError)
		return
	}

	// Set content type header first
	w.Header().Set("Content-Type", "application/json")
	sessionCreate(w, r, store, userID)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int{"user_id": userID})
}

func LoginUser(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore) {
	// Set CORS headers
	utils.SetCustomCORSHeaders(w, "http://localhost:3000", "POST, OPTIONS", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Declare a variable of type User
	var creds models.User

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Vigased andmed", http.StatusBadRequest)
		return
	}

	var user struct {
		ID           int
		PasswordHash string
	}

	err := database.Db.QueryRow(`
		SELECT id, password_hash 
		FROM users 
		WHERE username = $1
	`, creds.Username).Scan(&user.ID, &user.PasswordHash)

	if err == database.GetSqlErrNoRows() {
		http.Error(w, "Vale kasutajanimi või parool", http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(creds.Password)); err != nil {
		http.Error(w, "Vale kasutajanimi või parool", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	sessionCreate(w, r, store, user.ID)
	json.NewEncoder(w).Encode(map[string]int{"user_id": user.ID})
}

func sessionCreate(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore, userID int) {
	// Create a session
	session, _ := store.Get(r, "session-name")
	session.Values["user_id"] = userID
	session.Save(r, w)
}
