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
    @State public var categories = [Category(name: "Trending"), Category(name: "Newest"), Category(name: "Fiction"), Category(name: "Business"), Category(name: "Biography")]
    @State public var user = User(fid: 0, custodyAddress: "", recoveryAddress: "", followingCount: 0, followerCount: 0, verifications: [], bio: "", displayName: "", pfpURL: "", username: "", powerBadgeUser: false)
    @State public var friendsBooks: [Book] = []
    
    func loadBookFeed() {
        BookManager.shared.fetchBooks(category: category, fid: user.fid) { result in
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
        books = []
        showProgressView = true
        category = selectedCategory
        if selectedCategory == "Friends" {
            books = friendsBooks
            showProgressView = false
        } else {
            loadBookFeed()
        }
    }
    
    func checkAuthStatus() {
        UserManager.shared.getUserInfo() { result in
            switch result {
            case .success(let userData):
                if(userData.fid != 0) {
                    if !self.categories.contains(where: { $0.name == "Friends" }) {
                        self.categories.append(Category(name: "Friends"))
                    }
                    user = userData
                    BookManager.shared.fetchBooks(category: "Friends", fid: user.fid) { result in
                                switch result {
                                case .success(let books):            
                                    self.friendsBooks = books
                                    showProgressView = false
                                case .failure(let error):
                                    // Handle error
                                    showProgressView = false
                                    print("Failed to fetch books: \(error)")
                                }
                            }
                }
                
                break
            case .failure(let error):
                print("Failed to get user: \(error)")
            }
        }
    }
    
    var body: some View {
        VStack {
            if showProgressView == true {
                Spacer()
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .black))
                Spacer()
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
            checkAuthStatus()
        }
        .background(Color.white)
    }
}

#Preview {
    BookFeedView()
}
