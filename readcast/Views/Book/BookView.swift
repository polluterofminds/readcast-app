//
//  BookView.swift
//  readcast
//
//  Created by Justin Hunter on 3/17/24.
//

import SwiftUI

struct BookView: View {  
    @Environment(\.presentationMode) var presentationMode
    @State public var isPresented = false
    @State public var showCommentModal = false
    @State public var book: Book
    @State public var reviews: [ReviewItem] = []
    @State public var reviewsLoading: Bool = true
    @State public var libraryItem: LibraryItem = LibraryItem(book_id_fid_key: "", fid: 0, book_id: "", status: "", books: Book(id: "", author: "", categories: "", createdAt: "", description: "", thumbnail: "", title: "", reviews: 0, titleAuthorKey: ""), user_id: nil)
    @State public var options = [StatusValue(display: "To Read", value: "tbr", icon: "bookmark"), StatusValue(display: "In Progress", value: "in-progress", icon: "book"), StatusValue(display: "Completed", value: "completed", icon: "checkmark.seal"), StatusValue(display: "Remove From Library", value: "remove", icon: "minus.circle")]
    @State public var selectedStatus = StatusValue(display: "Add to Library", value: "atl", icon: "bookmark")
    @State public var date = Date()
    @State public var castText = ""
    @State public var submitting = false
    
    func loadReviews(bookToLoad: Book) {
        print("loading reviews...")
        BookManager.shared.fetchReviews(bookId: book.id ?? "") { result in
                    switch result {
                    case .success(let reviews):
                        self.reviews = reviews
                    case .failure(let error):
                        print("Failed to fetch reviews: \(error)")
                    }
                }
        reviewsLoading = false
    }
    
    func loadLibraryStatus(bookToLoad: Book) {
        print("Loading from library")
        let authStatus = UserManager.shared.authStatus
        if authStatus.isWarpcast {
            BookManager.shared.fetchBookFromLibrary(bookId: bookToLoad.id ?? "") { result in
                switch result {
                case .success(let item):
                    self.libraryItem = item
                    setStatus()
                    break
                case .failure(let error):
                    print("Failed to fetch books: \(error)")
                }
            }
        }
    }
    
    func setStatus() {
        if libraryItem.status != "" {
            switch libraryItem.status {
            case "in-progress":
                selectedStatus = StatusValue(display: "In Progress", value: "in-progress", icon: "book")
                break
            case "tbr":
                selectedStatus = StatusValue(display: "To Read", value: "tbr", icon: "bookmark")
                break
            case "completed":
                selectedStatus = StatusValue(display: "Completed", value: "completed", icon: "checkmark.seal")
                break
            case .none:
                print("No status")
                break
            case .some(_):
                print("No status, other")
                break
            }
        }
    }
    
    func retrieveItemsFromUserDefaults() -> [Book]? {
        guard let data = UserDefaults.standard.data(forKey: "recent_searches") else { return nil }
        do {
            let decoder = JSONDecoder()
            let items = try decoder.decode([Book].self, from: data)
            return items
        } catch {
            print("Error decoding items: \(error.localizedDescription)")
            return nil
        }
    }
    
    func saveItemsToUserDefaults(_ item: Book) {
        do {
            var recentSearches = retrieveItemsFromUserDefaults() ?? []
            if !recentSearches.contains(where: { $0.id == item.id }) {
                    recentSearches.append(item)
                    let encoder = JSONEncoder()
                    let encodedData = try encoder.encode(recentSearches)
                    UserDefaults.standard.set(encodedData, forKey: "recent_searches")
                    }
        } catch {
            print("Error encoding items: \(error.localizedDescription)")
        }
    }
    
    func resetLibraryStatus() {
        libraryItem = LibraryItem(book_id_fid_key: "", fid: 0, book_id: "", status: "", books: Book(id: "", author: "", categories: "", createdAt: "", description: "", thumbnail: "", title: "", reviews: 0, titleAuthorKey: ""), user_id: nil)
    }
    
    func loadBookByTitleAuthorKey() {
        print("Loading by title author key")
        saveItemsToUserDefaults(book)
        BookManager.shared.fetchBookByTitleAuthorKey(titleAuthorKey: book.titleAuthorKey ?? "") { result in
            switch result {
            case .success(let bookResult):
                self.book = bookResult
                //  load reviews now
                loadReviews(bookToLoad: bookResult)
                loadLibraryStatus(bookToLoad: bookResult)
                break
            case .failure(let error):
                print("Failed to fetch books: \(error)")
            }
        }
    }
    
    func updateStatus(newStatus: StatusValue) async {
        selectedStatus = newStatus
        if newStatus.value == "in-progress" || newStatus.value == "completed" {
            isPresented = true
        } else if newStatus.value == "tbr" {
            await updateBookInLibrary(bookType: "paperback")
        } else if newStatus.value == "remove" {
            //  Remove from library
            if UserManager.shared.authStatus.isWarpcast {
                BookManager.shared.removeBookFromLibrary(bookId: book.id!) { result in
                    switch result {
                    case .success(_):
                        resetLibraryStatus()
                        selectedStatus = StatusValue(display: "Add to Library", value: "atl", icon: "bookmark")
                        break
                    case .failure(let error):
                        print("Failed to fetch books: \(error)")
                    }
                }
            } else {
                await DBManager.shared.removeFromLibrary(bookId: book.id!)
                let items = await DBManager.shared.loadSingLibraryItem(bookId: book.id!)
                if !items.isEmpty {
                    libraryItem = items.first ?? libraryItem
                    setStatus()
                } else {
                    resetLibraryStatus()
                    selectedStatus = StatusValue(display: "Add to Library", value: "atl", icon: "bookmark")
                }
            }
        }
    }
    
    func updateBookInLibrary(bookType: String) async {
        let authStatus = UserManager.shared.authStatus
        //  Need to know if book was in Library or not
        if libraryItem.status != "" {
            if authStatus.isWarpcast {
                //  It's in the library
                let dateToUse = selectedStatus.value == "completed" ? date : nil
                BookManager.shared.upsertLibraryStatus(book: book, libraryId: libraryItem.id ?? "", bookStatus: selectedStatus.value, bookType: bookType, dateCompleted: dateToUse) { result in
                    switch result {
                    case .success(_):
                        isPresented = false
                        loadLibraryStatus(bookToLoad: book)
                        break
                    case .failure(let error):
                        print("Failed to fetch books: \(error)")
                    }
                }
            } else {
                let user_id = UserManager.shared.session?.user.id
                let email = UserManager.shared.session?.user.email
                await DBManager.shared.upsertBookInLibrary(item: LibraryInsert(id: libraryItem.id, book_id: book.id ?? "", status: selectedStatus.value, book_type: bookType, date_completed: nil, book_id_fid_key: book.id! + email!, user_id: user_id!))
                isPresented = false
                loadLibraryStatus(bookToLoad: book)
            }
        } else {
            if authStatus.isWarpcast {
                BookManager.shared.addBookToLibrary(book: book, bookStatus: selectedStatus.value, bookType: bookType) { result in
                    switch result {
                    case .success(_):
                        isPresented = false
                        loadBookByTitleAuthorKey()
                        break
                    case .failure(let error):
                        print("Failed to fetch books: \(error)")
                    }
                }
            } else {
                let user_id = UserManager.shared.client.auth.currentUser?.id
                let email = UserManager.shared.client.auth.currentUser?.email
                
                if user_id != nil && email != nil {
                    await DBManager.shared.insertBookInLibrary(item: LibraryInsert(id: libraryItem.id, book_id: book.id ?? "", status: selectedStatus.value, book_type: bookType, date_completed: nil, book_id_fid_key: book.id! + email!, user_id: user_id!))
                    isPresented = false
                    loadBookByTitleAuthorKey()
                }
            }
        }
    }
    
    func submitCast() {
        if castText.count <= 240 {
            submitting = true
            let authStatus = UserManager.shared.authStatus
            if authStatus.isWarpcast {
                BookManager.shared.submitComment(book: book, commentText: castText) { result in
                    switch result {
                    case .success(_):
                        castText = ""
                        loadReviews(bookToLoad: book)
                        submitting = false
                        showCommentModal = false
                        break
                    case .failure(let error):
                        print("Failed to fetch books: \(error)")
                        submitting = false
                    }
                }
            } else {
                Task {
                    await DBManager.shared.submitReview(book: book, review: castText)
                    castText = ""
                    loadReviews(bookToLoad: book)
                    submitting = false
                    showCommentModal = false
                }
            }
        }
    }

    var body: some View {
        VStack {
            ScrollView {
                BookHeaderView(book: book)
                BookActionView(libraryItem: $libraryItem, options: options, selectedStatus: $selectedStatus, updateStatus: updateStatus)
                BookDiscussionView(book: book, reviews: $reviews, reviewsLoading: $reviewsLoading, loadReviews: loadReviews)
                Spacer()
            }
            Button(action: {
                    showCommentModal = true
                }) {
                    Text("Discuss Book")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(hexToColor(hex: "#CEFF41"))
                        .foregroundColor(.black)
                        .font(Font.custom(ConfigManager.shared.primaryFont, size: 16))
                }
        }
        .edgesIgnoringSafeArea(.bottom)
        .sheet(isPresented: $showCommentModal, content: {
            BookReviewSheetView(isPresented: $showCommentModal, castText: $castText, submitting: $submitting, submitCast: submitCast)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color.white)
                .edgesIgnoringSafeArea(.bottom)
        })
        .sheet(isPresented: $isPresented, content: {
            BookStatusView(isPresented: $isPresented, date: $date, selectedStatus: $selectedStatus, updateStatus: updateBookInLibrary)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(Color.white)
                        .edgesIgnoringSafeArea(.bottom)
                })
        .background(Color.white)
        .onAppear {
            if book.id == "" {
                loadBookByTitleAuthorKey()
            } else {
                loadReviews(bookToLoad: book)
                let authStatus = UserManager.shared.authStatus
                if authStatus.isWarpcast {
                    loadLibraryStatus(bookToLoad: book)
                } else {
                    Task {
                        let items = await DBManager.shared.loadSingLibraryItem(bookId: book.id!)
                        if !items.isEmpty {
                            libraryItem = items.first ?? libraryItem
                            setStatus()
                        }
                    }
                }
            }
        }
        .navigationBarBackButtonHidden(true)
        .navigationBarItems(leading:
            Button(action: {
                self.presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "chevron.left")
                    .foregroundColor(.black)
            }
        )
    }
}

#Preview {
    BookView(book: Book(id: "31177c58-c61f-4fd5-a244-fd75a7c843fd", author: "Cixin Liu", categories: "Fiction", createdAt: "2024-01-27T16:49:16.530753+00:00", description: "Soon to be a Netflix Original Series! An NPR Best Book of the Decade Winner of the Hugo Award for Best Novel “War of the Worlds for the 21st century.” – Wall Street Journal The Three-Body Problem is the first chance for English-speaking readers to experience the Hugo Award-winning phenomenon from China's most beloved science fiction author, Liu Cixin. Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens. An alien civilization on the brink of destruction captures the signal and plans to invade Earth. Meanwhile, on Earth, different camps start forming, planning to either welcome the superior beings and help them take over a world seen as corrupt, or to fight against the invasion. The result is a science fiction masterpiece of enormous scope and vision. The Three-Body Problem Series The Three-Body Problem The Dark Forest Death's End Other Books Ball Lightning Supernova Era To Hold Up The Sky (forthcoming) At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.", thumbnail: "https://books.google.com/books/content?id=ZrNzAwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api", title: "The Three-Body Problem", reviews: 12, titleAuthorKey: ""))
}
