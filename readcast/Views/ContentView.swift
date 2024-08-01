//
//  ContentView.swift
//  readcast
//
//  Created by Justin Hunter on 12/26/23.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var navigationManager: NavigationManager
    var body: some View {
        NavigationStack {
            VStack {
                HomeHeaderView()
                BookFeedView()
                BottomNavView()
                NavigationLink(
                    destination: BookView(book: navigationManager.currentBook ?? Book(id: "", author: "", categories: "", createdAt: "", description: "", thumbnail: "", title: "", reviews: 0, titleAuthorKey: "")),
                    isActive: Binding<Bool>(
                        get: { navigationManager.currentBook != nil },
                        set: { _ in }
                    )
                ) {
                    EmptyView()
                }
            }
            .background(Color.white)
        }
    }
}

#Preview {
    ContentView()
}
