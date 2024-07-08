//
//  LibraryView.swift
//  readcast
//
//  Created by Justin Hunter on 3/17/24.
//

import SwiftUI

struct LibraryView: View {
    @State private var loading = true
    @State public var library: [LibraryItem] = []
    @State public var filteredLibrary: [LibraryItem] = []
    @State public var category: LibraryCategory = LibraryCategory(name: "tbr", displayName: "To Read")
    
    func filterLibraryItems() {
        if category.name == "all" {
            filteredLibrary = library
        } else if category.name == "tbr" {
            filteredLibrary = library.filter { $0.status == category.name || $0.status == nil }
        } else {
            filteredLibrary = library.filter { $0.status == category.name }
        }
        loading = false
    }
    func loadLibraryItems() async {
        let authStatus = UserManager.shared.authStatus
        if authStatus.isWarpcast {
            BookManager.shared.fetchBooksFromLibrary() { result in
                        switch result {
                        case .success(let books):              
                            self.library = books
                            filterLibraryItems()
                        case .failure(let error):
                            print("Failed to fetch library: \(error)")
                            loading = false
                        }
                    }
        } else {
            let books = await DBManager.shared.loadLibrary()
            library = books
            filterLibraryItems()
        }
    }
    var body: some View {
        VStack {
            if loading {
                Spacer()
                HStack {
                    Spacer()
                        .foregroundColor(.black)
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .black))
                    Spacer()
                }
                Spacer()
            } else {
                LibraryCategoriesView(category: $category, filterLibrary: filterLibraryItems)
                ScrollView {
                    LibraryResultsView(results: $filteredLibrary, loadLibraryItems: loadLibraryItems)
                }
            }
        }
        .padding(.top, 20)
        .background(.white)
        .onAppear {
            Task {
                await loadLibraryItems()
            }
        }
        .navigationBarBackButtonHidden(true)
        .navigationBarItems(leading:
            SearchHeaderView()
        )
    }
}

#Preview {
    LibraryView()
}
