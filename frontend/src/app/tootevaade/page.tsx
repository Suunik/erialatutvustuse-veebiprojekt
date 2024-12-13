"use client";

import Offer from '../../components/product_view/offer';
import Header from '../../components/header';
import Footer from '../../components/footer/footer';
import { useLoginService } from '../../components/login/login_service';
import { useSearchParams } from 'next/navigation';
import { Book } from '@/components/models/book';
import { useEffect, useState } from 'react';
import { CartProvider } from "../../components/shopping_cart/cart_content";

export default function ProductViewPage() {
  const { isLoggedIn, handleLoginLogout } = useLoginService();
  const searchParams = useSearchParams();
  const bookID = searchParams.get("bookID");

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookID) {
      setError("Invalid book ID.");
      setLoading(false);
      return;
    }
    fetchBookByID(bookID);
  }, [bookID]);

  const fetchBookByID = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/getBookByID?id=${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error("Failed to fetch book.");
      const bookData: Book = await response.json();
      setBook(bookData);
    } catch (err) {
      console.error(err);
      setError("Failed to load book.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <CartProvider>
      <div className="max-w-[1920px] mx-auto min-h-screen flex flex-col items-center justify-between font-[family-name:var(--font-geist-sans)]">
        <Header isLoggedIn={isLoggedIn} onLoginLogout={handleLoginLogout} />
        <main className="flex-grow flex items-center justify-center w-full">
          {book ? <Offer book={book} /> : <p>Book not found</p>}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
