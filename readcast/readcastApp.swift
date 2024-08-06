//
//  readcastApp.swift
//  readcast
//
//  Created by Justin Hunter on 12/26/23.
//

import SwiftUI

@main
struct readcastApp: App {
    @StateObject private var navigationManager = NavigationManager()
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(AppLifecycleWatcher())
                .environmentObject(navigationManager)
                .onOpenURL { url in
                    navigationManager.handleDeepLink(url: url)
                }
                .background(Color.white)
        }
    }
}

class NavigationManager: ObservableObject {
    @Published var navigateToReview: (bookId: String, reviewId: String)?
    @Published var currentBook: Book?
    
    func handleDeepLink(url: URL) {
        print(url)
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true),
              let host = components.host else {
            print("Failed to create URLComponents")
            return
        }
        
        print(host == "reviews")
        
        if host == "reviews" {
            let pathComponents = components.path.split(separator: "/")
            print(pathComponents)
            if pathComponents.count == 2 {
                let bookId = String(pathComponents[0])
                let reviewId = String(pathComponents[1])
                navigateToReview = (bookId, reviewId)
                fetchBookById(bookId: bookId)
                print("Navigate to Review: bookId=\(bookId), reviewId=\(reviewId)") // Debug print
            } else {
                print("Invalid path components")
            }
        } else {
            print("Invalid host or missing parameters")
        }
    }
    
    private func fetchBookById(bookId: String) {
            // Example fetch logic, replace with actual fetching logic
            BookManager.shared.fetchBookById(bookId: bookId) { result in
                switch result {
                case .success(let book):
                    DispatchQueue.main.async {
                        self.currentBook = book
                    }
                case .failure(let error):
                    print("Failed to fetch book: \(error)")
                }
            }
        }
}
