//
//  BottomNavView.swift
//  readcast
//
//  Created by Justin Hunter on 3/17/24.
//

import SwiftUI

struct BottomNavView: View {
    var body: some View {
        HStack {
            Image(systemName: "house.fill")
                .foregroundColor(hexToColor(hex: "#0E0E0E"))
            Spacer()
            NavigationLink(destination: LibraryView()) {
                Image(systemName: "book.fill")
                    .foregroundColor(.gray)
            }
            Spacer()
            NavigationLink(destination: SearchView()) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)
            }
        }
        .padding(.horizontal, 50)
        .padding(.top, 10)
    }
}

#Preview {
    BottomNavView()
}
