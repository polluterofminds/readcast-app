//
//  BookFeedView.swift
//  readcast
//
//  Created by Justin Hunter on 3/11/24.
//

import SwiftUI

struct Category {
    let name: String
}

struct BookFeedView: View {
    @State public var category: String = "Trending"
    @State public var books: [Book] = []
    @State public var showProgressView: Bool = true
    var categories = [Category(name: "Trending"), Category(name: "Newest"), Category(name: "Fiction"), Category(name: "Business"), Category(name: "Biography")]
    
    func loadBookFeed() {
        BookManager.shared.fetchBooks(category: category) { result in
                    switch result {
                    case .success(let books):
                        self.books = books
                        showProgressView = false
                    case .failure(let error):
                        // Handle error
                        showProgressView = false
                        print("Failed to fetch books: \(error)")
                    }
                }
    }
    
    func selectCategory(selectedCategory: String) {
        category = selectedCategory
        loadBookFeed()
    }
    
    var body: some View {
        VStack {
            if showProgressView {
                ProgressView()
            } else {
                ScrollView(.horizontal) {
                    HStack {
                        ForEach(categories, id: \.name) { cat in
                            ZStack {
                                if category == cat.name {
                                    LinearGradient(
                                        gradient: Gradient(colors: [hexToColor(hex: "#CEFF41"), .white]),
                                        startPoint: .top,
                                        endPoint: .bottom
                                    ).frame(width: 110, height: 28)
                                } else {
                                    Color.white.edgesIgnoringSafeArea(.all).frame(width: 110, height: 28)
                                }
                                
                                Button(action: {
                                    selectCategory(selectedCategory: cat.name)
                                }) {
                                    Text(cat.name)
                                        .font(.system(size: 14))
                                        .foregroundColor(.black)
                                        .padding(5)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 0)
                                                .stroke(Color.black, lineWidth: 1)
                                                .frame(width: 110, height: 28))
                                }
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                ScrollView {
                    ForEach(books, id: \.id) { book in
                        BookItemView(book: book)
                    }
                }
            }
        }.onAppear {
            loadBookFeed()
        }
        .background(Color.white)
    }
}

#Preview {
    BookFeedView()
}
