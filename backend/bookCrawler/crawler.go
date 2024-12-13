package bookcrawler

import (
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"os"

	"github.com/chromedp/chromedp"
	"github.com/gocolly/colly"
	"golang.org/x/exp/rand"
)

func Crawl() {
	baseURL := "https://www.apollo.ee/raamatud/eestikeelsed-raamatud"
	// Categories to scrape
	categories := map[string]string{
		"Ajalugu": "ajalugu",
	}

	results := make(map[string][]models.Book)

	// Iterate through categories and scrape data
	for category, path := range categories {
		categoryURL := fmt.Sprintf("%s/%s", baseURL, path)
		fmt.Printf("Scraping category: %s (%s)\n", category, categoryURL)
		books := scrapeCategory(categoryURL, category)
		results[category] = books
	}

	// Save results to a JSON file
	saveResults(results, "books.json")
}

func scrapeCategory(categoryURL string, category string) []models.Book {
	var books []models.Book
	c := colly.NewCollector()

	// Limit the number of books
	bookLimit := 50
	bookCount := 0

	// Scraping logic for each book item in the category
	c.OnHTML("div.product", func(e *colly.HTMLElement) {
		if bookCount >= bookLimit {
			return
		}

		// Find the link to the book detail page
		bookURL := e.ChildAttr("a", "href")
		if bookURL != "" {
			// Ensure the URL is absolute (prepend the base URL if needed)
			if !hasProtocol(bookURL) {
				bookURL = "https://www.apollo.ee" + bookURL
			}

			// Visit the book page and get detailed information
			bookDetails := getBookData(bookURL, category)

			// Append the book to the books slice
			books = append(books, bookDetails)
			bookCount++ // Increment the counter
			fmt.Printf("book number: %s \n", bookCount)
		}
	})

	// Handle pagination to visit the next pages of the category
	c.OnHTML(".pagination-next a", func(e *colly.HTMLElement) {
		if bookCount >= bookLimit {
			return
		}

		nextPage := e.Request.AbsoluteURL(e.Attr("href"))
		if nextPage != "" {
			fmt.Printf("Visiting next page: %s\n", nextPage)
			c.Visit(nextPage)
		}
	})

	// Start scraping the initial category page
	fmt.Printf("Visiting category: %s\n", categoryURL)
	c.Visit(categoryURL)

	return books
}

// Helper function to check if a URL has a protocol (e.g., http:// or https://)
func hasProtocol(url string) bool {
	return len(url) > 4 && (url[:4] == "http" || url[:5] == "https")
}

func getBookData(url string, category string) models.Book {
	var book models.Book

	// Create a new chromedp context
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	// Run chromedp tasks to load the page and extract the information
	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.WaitVisible(".product", chromedp.ByQuery),                                                          // Wait for the content to load
		chromedp.Text(".product__main-info__content-title", &book.Title, chromedp.ByQuery),                          // Get title
		chromedp.Text(".product__main-info__content-authors .info__text", &book.Author, chromedp.ByQuery),           // Get author
		chromedp.Text(".expandable-text-wrapper .expandable-text", &book.Description, chromedp.ByQuery),             // Get description
		chromedp.AttributeValue(".product__main-info__cover .media-gallery img", "data-src", &book.PictureURL, nil), // Fetch image URL
	)

	if err != nil {
		log.Printf("Error fetching book data for %s: %v\n", url, err)
	}

	// Assign a random price ending in .99
	rand.Seed(uint64(time.Now().UnixNano()))   // Convert int64 to uint64
	randomPrice := float64(rand.Intn(100) + 1) // Random number between 1 and 100
	book.Price = randomPrice + 0.99
	book.Category = category

	// Log the price and image URL for debugging
	log.Printf("Random Price: %.2f", book.Price)
	if book.PictureURL != "" {
		log.Printf("Image URL: %s", book.PictureURL)
	}

	return book
}

func saveResults(data map[string][]models.Book, filename string) {
	file, err := os.Create(filename)
	if err != nil {
		log.Fatalf("Could not create file: %v", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(data); err != nil {
		log.Fatalf("Could not write data to file: %v", err)
	}
	fmt.Printf("Data saved to %s\n", filename)
}
