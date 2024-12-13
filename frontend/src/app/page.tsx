"use client";

import { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer/footer";
import BookCard from "../components/books/bookcard";
import { Book } from "../components/models/book";
import "../app/globals.css";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [books, setBooks] = useState<Book[]>([]); // State for books
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for errors

  useEffect(() => {
    // Check if user data exists in sessionStorage
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(user.isLoggedIn);
    }
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // Clear session storage on logout
      sessionStorage.removeItem("user");
    }
    setIsLoggedIn(!isLoggedIn);
  };

  const fetchBooks = async () => {
    setLoading(true);
    setError(null); // Reset error state
  
    try {
      // Generate two random IDs between 0 and 200
      const randomIds = [
        Math.floor(Math.random() * 201), // Random integer from 0 to 200
        Math.floor(Math.random() * 201),
      ];
  
      // Fetch books sequentially for each random ID
      const bookPromises = randomIds.map(async (id) => {
        const response = await fetch(`http://localhost:8080/getBookByID?id=${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch book with ID: ${id}`);
        }
        return response.json();
      });
  
      // Wait for all books to be fetched
      const booksData = await Promise.all(bookPromises);
  
      // Update the books state with the fetched data
      setBooks(booksData.map((book: any) => ({ ...book }))); // Assuming the response matches the Book model
    } catch (err) {
      console.error(err);
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="max-w-[1920px] mx-auto grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-0 gap-20 font-[family-name:var(--font-geist-sans)]">
      <Header isLoggedIn={isLoggedIn} onLoginLogout={handleLoginLogout} />
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {/* Book cards section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-20">
          {books.map((book, index) => (
            <BookCard
              key={book.id}
              {...book}
              offerLabel={index % 2 === 0 ? "Nädalapakkumine" : "Kuupakkumine"} // Alternate labels
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}