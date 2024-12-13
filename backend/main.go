package main

import (
	"backend/database"
	"backend/routers"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/sessions"
)

var store *sessions.CookieStore

func init() {
	// Initialize session store with secret key
	sessionSecret := os.Getenv("SESSION_SECRET")
	if sessionSecret == "" {
		sessionSecret = "your-secret-key" // Default secret key for development
	}
	store = sessions.NewCookieStore([]byte(sessionSecret))

	// Configure session store
	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7, // 7 days
		HttpOnly: true,
		Secure:   false, // Set to true in production with HTTPS
		SameSite: http.SameSiteLaxMode,
	}
}

func main() {

	// Connect to PostgreSQL database
	database.ConnectToDatabase()
	// Create tables (if needed)
	database.CreateTables()
	// Create default admin user
	database.CreateDefaultUser(0, "Admin", "admin")
	database.CreateDefaultUser(1, "Kasutaja", "Parool123")
	// Fill book tables (if needed)
	database.FillBooksTable("databaseData")

	// Setup routes
	routers.SetupRoutes(store)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server started on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))

}
