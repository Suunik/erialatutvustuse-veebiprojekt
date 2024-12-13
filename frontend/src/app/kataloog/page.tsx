"use client"
import React, { useEffect, useState } from "react";
import Catalog from "../../components/catalog_template/catalog";
import Header from "../../components/header";
import Footer from "../../components/footer/footer";
import { useLoginService } from "../../components/login/login_service";
import { Book } from "../../components/models/book";

const CatalogPage = () => {
  const { isLoggedIn, handleLoginLogout } = useLoginService();
  const [catalogName, setCatalogName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]); // Store fetched books
  const [error, setError] = useState<string | null>(null); // Handle errors

  // Function to extract catalog name from the URL
  const getCatalogNameFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("catalogName");
  };

  // This effect runs when the page loads or the catalogName in the URL changes
  useEffect(() => {
    const catalogNameFromURL = getCatalogNameFromURL();
    if (catalogNameFromURL && catalogNameFromURL !== catalogName) {
      setCatalogName(catalogNameFromURL); // Update catalog name if it's different from current state
    }
  }, [window.location.search]); // Dependency on window.location.search to watch for URL changes

  // Fetch books when catalogName changes
  useEffect(() => {
    if (catalogName) {
      fetchBooks(catalogName); // Fetch books for the new catalog name
    }
  }, [catalogName]); // Only trigger fetchBooks when catalogName changes

  // Fetch books based on the catalog name
  const fetchBooks = async (tag: string) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await fetch(
        `http://localhost:8080/getBooksByTag?tag=${encodeURIComponent(tag)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      const booksData = data.map((book: any) => ({
        id: book.id,
        user_id: book.user_id,
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        price: book.price,
        picture_url: book.picture_url,
        created_at: book.created_at,
      }));
      setBooks(booksData); // Update the books state with the fetched data
    } catch (err) {
      console.error(err);
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="flex flex-col min-h-screen max-w-[1920px] mx-auto font-[family-name:var(--font-geist-sans)]">
          <Header isLoggedIn={isLoggedIn} onLoginLogout={handleLoginLogout} />
          <main className="flex-grow">
            {/* Render the Catalog only, which will update when the catalogName state changes */}
            <Catalog bookList={books} catalogName={catalogName} />
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
