//
//  SearchResultsView.swift
//  readcast
//
//  Created by Justin Hunter on 4/1/24.
//

import SwiftUI

struct SearchResultsView: View {
    @Binding var results: [SearchItem]
    
    func retrieveItemsFromUserDefaults() -> [SearchItem]? {
        guard let data = UserDefaults.standard.data(forKey: "recent_searches") else { return nil }
        do {
            let decoder = JSONDecoder()
            let items = try decoder.decode([SearchItem].self, from: data)
            return items
        } catch {
            print("Error decoding items: \(error.localizedDescription)")
            return nil
        }
    }
    
    var body: some View {
        ForEach(results, id: \.id) { book in
            NavigationLink(destination: BookView(book: Book(id: "", author: book.author, categories: book.category, createdAt: "", description: book.description, thumbnail: book.thumbnail, title: book.title, reviews: 0, titleAuthorKey: (book.title) + "-" + (book.author)))) {
                BookHeaderView(book: Book(id: "", author: book.author, categories: book.category, createdAt: "", description: book.description, thumbnail: book.thumbnail, title: book.title, reviews: 0, titleAuthorKey: (book.title) + "-" + (book.author)))
            }
            .background(.white)
        }
    }
}

struct SearchResultsView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewWrapper()
    }

    struct PreviewWrapper: View {
        @State private var results: [SearchItem] = [SearchItem(id: "4uuxzwEACAAJ", isbn10: nil, isbn13: nil, title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", description: "Simplified Chinese edition of Tomorrow, and Tomorrow, and Tomorrow", thumbnail: "https://books.google.com/books/content?id=4uuxzwEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api", category: "Fiction")]

        var body: some View {
            SearchResultsView(results: $results)
        }
    }
}
