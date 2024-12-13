package utils

import "net/http"

// SetCustomCORSHeaders sets the custom CORS headers
func SetCustomCORSHeaders(w http.ResponseWriter, allowedOrigin, allowedMethods, allowedHeaders string) {
	w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
	w.Header().Set("Access-Control-Allow-Methods", allowedMethods)
	w.Header().Set("Access-Control-Allow-Headers", allowedHeaders)
}
