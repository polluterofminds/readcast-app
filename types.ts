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
  id: string;
  title: string;
  review: string;
  fid: number;
  timestamp: number;
  stars?: number;
  users: User
}