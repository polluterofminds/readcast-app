export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  reviews: number;
  category: string;
}

export interface Review {
  id: string;
  title: string;
  review: string;
  fid: number;
  timestamp: number;
  stars?: number;
  books: Book;
}

export interface User {
  id: string, 
  fid: number, 
  username?: string | null;
  pfp?: string | null;
  bio?: string;
  display_name?: string;
}

export interface ReviewWithUser {
  created_at: string;
  id: string;
  title: string;
  review: string;
  fid: number;
  timestamp: number;
  stars?: number;
  users: User
}

export type LibraryWithBook = {
  id: string;
  created_at: string;
  status: string;
  fid: number;
  book_id: string;
  book_type?: string;
  date_completed?: string;
  books: Book
}

export interface Library {
  tbr: LibraryWithBook[];
  inProgress: LibraryWithBook[];
  completed: LibraryWithBook[];
}