//
//  LibraryCategoriesView.swift
//  readcast
//
//  Created by Justin Hunter on 4/8/24.
//

import SwiftUI

struct LibraryCategory {
    let name: String
    let displayName: String
}

struct LibraryCategoriesView: View {
    @Binding public var category: LibraryCategory
    var categories = [LibraryCategory(name: "tbr", displayName: "To Read"), LibraryCategory(name: "in-progress", displayName: "In Progress"), LibraryCategory(name: "completed", displayName: "Completed"), LibraryCategory(name: "all", displayName: "All")]
    
    var filterLibrary: () -> Void
    
    func selectCategory(selectedCategory: LibraryCategory) {
        category = selectedCategory
        filterLibrary()
    }
    
    var body: some View {
        ScrollView(.horizontal) {
            HStack {
                ForEach(categories, id: \.name) { cat in
                    ZStack {
                        if category.name == cat.name {
                            LinearGradient(
                                gradient: Gradient(colors: [hexToColor(hex: "#CEFF41"), .white]),
                                startPoint: .top,
                                endPoint: .bottom
                            ).frame(width: 110, height: 28)
                        } else {
                            Color.white.edgesIgnoringSafeArea(.all).frame(width: 110, height: 28)
                        }
                        
                        Button(action: {
                            selectCategory(selectedCategory: cat)
                        }) {
                            Text(cat.displayName)
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
    }
}

struct LibraryCatefories_Previews: PreviewProvider {
    static func filterLibrary() {
        // Implementation if needed
    }
    
    static var previews: some View {
        LibraryCategoriesView(category: .constant(LibraryCategory(name: "tbr", displayName: "To Read")), filterLibrary: filterLibrary)
    }
}
