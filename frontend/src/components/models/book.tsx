export interface Book {
    id: number;            // Primary key for the book (auto-incremented integer)
    user_id: number;       // User ID associated with the book (foreign key)
    title: string;         // Book title (string up to 255 characters)
    author: string;        // Author of the book (string up to 255 characters)
    description: string;   // Description of the book (text)
    category: string;      // Category of the book (e.g., Fiction, Non-fiction)
    price: number;         // Price of the book (numeric with 2 decimal places)
    picture_url: string;    // URL to the book's cover image (string up to 255 characters)
    created_at: string;    // Timestamp when the book was created (ISO 8601 format)
  }