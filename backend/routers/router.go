package routers

import (
	"backend/controllers"
	"backend/utils"
	"encoding/json"
	"net/http"

	"github.com/gorilla/sessions"
)

func SetupRoutes(store *sessions.CookieStore) {
	// Define routes
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		controllers.RegisterUser(w, r, store)
	})
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		controllers.LoginUser(w, r, store)
	})
	http.HandleFunc("/addBook", func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		utils.SetCustomCORSHeaders(w, "http://localhost:3000", "POST, OPTIONS", "Content-Type, Accept, Content-Length")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		controllers.AddBook(w, r)
	})
	http.HandleFunc("/getBookByID", controllers.GetBookByID)
	http.HandleFunc("/getBooks", controllers.GetBooks)
	http.HandleFunc("/getBooksByTag", controllers.GetBooksByTag)
	http.HandleFunc("/addFeedback", controllers.AddFeedback)
	http.HandleFunc("/getFeedback", controllers.GetFeedback)

	// Add default route with CORS headers
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		utils.SetCustomCORSHeaders(w, "http://localhost:3000", "GET", "Content-Type")

		// Prepare and send JSON response
		response := map[string]string{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})
}
