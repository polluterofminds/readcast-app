//
//  LibraryResultsView.swift
//  readcast
//
//  Created by Justin Hunter on 4/8/24.
//

import SwiftUI

struct LibraryResultsView: View {
    @Binding var results: [LibraryItem]
    var loadLibraryItems: () async -> Void
    private func delete(bookId: String) async {
        if UserManager.shared.authStatus.isWarpcast {
            BookManager.shared.removeBookFromLibrary(bookId: bookId) { result in
                switch result {
                case .success(_):
                    // Handle successful deletion if needed
                    Task {
                        await loadLibraryItems()
                    }
                    break
                case .failure(let error):
                    print("Failed to fetch books: \(error)")
                }
            }
        } else {
            await DBManager.shared.removeFromLibrary(bookId: bookId)
            await loadLibraryItems()
        }
    }
    var body: some View {
        ForEach(results, id: \.id) { book in
            HStack {
                NavigationLink(destination: BookView(book: Book(id: book.books.id, author: book.books.author, categories: book.books.categories, createdAt: "", description: book.books.description, thumbnail: book.books.thumbnail, title: book.books.title, reviews: 0, titleAuthorKey: (book.books.title ?? "") + "-"))) {
                    HStack {
                        BookHeaderView(book: Book(id: book.books.id, author: book.books.author, categories: book.books.categories, createdAt: "", description: book.books.description, thumbnail: book.books.thumbnail, title: book.books.title, reviews: 0, titleAuthorKey: (book.books.title ?? "") + "-" + (book.books.author ?? "")))
                    }
                }
                Menu {
                    Button(action: {
                        Task {
                            await delete(bookId: book.books.id!)
                        }
                    }) {
                        HStack {
                            Text("Remove from library")
                            Image(systemName: "trash")
                                .foregroundColor(.gray)
                        }
                    }
                    .foregroundColor(.gray)
                    .padding(.trailing)
                } label: {
                    Label("", systemImage: "ellipsis")
                }
                .foregroundColor(.gray)
            }
        }
    }
}

struct LibraryResultsView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewWrapper()
    }
    
    struct PreviewWrapper: View {
        
        @State private var results: [LibraryItem] = [LibraryItem(id: "", book_id_fid_key: "", fid: 0, book_id: "", status: "tbr", book_type: "paperback", date_completed: "", books: Book(id: "31177c58-c61f-4fd5-a244-fd75a7c843fd", author: "Cixin Liu", categories: "Fiction", createdAt: "2024-01-27T16:49:16.530753+00:00", description: "Soon to be a Netflix Original Series! An NPR Best Book of the Decade Winner of the Hugo Award for Best Novel “War of the Worlds for the 21st century.” – Wall Street Journal The Three-Body Problem is the first chance for English-speaking readers to experience the Hugo Award-winning phenomenon from China's most beloved science fiction author, Liu Cixin. Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens. An alien civilization on the brink of destruction captures the signal and plans to invade Earth. Meanwhile, on Earth, different camps start forming, planning to either welcome the superior beings and help them take over a world seen as corrupt, or to fight against the invasion. The result is a science fiction masterpiece of enormous scope and vision. The Three-Body Problem Series The Three-Body Problem The Dark Forest Death's End Other Books Ball Lightning Supernova Era To Hold Up The Sky (forthcoming) At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.", thumbnail: "https://books.google.com/books/content?id=ZrNzAwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api", title: "The Three-Body Problem", reviews: 12, titleAuthorKey: ""), user_id: nil)]
        func mockLoadLibraryItems() async {
            // Simulate a delay
            do {
                try await Task.sleep(nanoseconds: 1 * 1_000_000_000) // 1 second delay
                // Add mock data if needed
            } catch {
                print("Error with sleep")
            }
        }
        var body: some View {
            LibraryResultsView(results: $results, loadLibraryItems: mockLoadLibraryItems)
        }
    }
}
