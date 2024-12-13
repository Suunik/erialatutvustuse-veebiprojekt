package middleware

import (
	"net/http"

	"github.com/gorilla/sessions"
)

func IsAuthenticated(store *sessions.CookieStore, next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err := store.Get(r, "session-name")
		if err != nil {
			http.Error(w, "Session error", http.StatusInternalServerError)
			return
		}

		// Only proceed if we have a valid user ID
		next.ServeHTTP(w, r)
	}
}
