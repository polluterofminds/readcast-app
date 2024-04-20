//
//  SearchbarView.swift
//  readcast
//
//  Created by Justin Hunter on 4/1/24.
//

import SwiftUI

struct SearchBarView: View {
    @Binding var searchText: String
    var body: some View {
        ZStack(alignment: .leading) {
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color.black, lineWidth: 1) // Black border
                .frame(height: 40)

            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray) // Placeholder text color
                ZStack {
                    if searchText.isEmpty {
                        HStack {
                            Text("Search")
                                .foregroundColor(.gray)
                            Spacer()
                        }
                    }
                    TextField("", text: $searchText)
                        .foregroundColor(.black)
                }
                
            }
            .padding(.horizontal, 10)
        }
        .padding(10)
    }
}

struct SearchbarView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewWrapper()
    }

    struct PreviewWrapper: View {
        @State private var searchText = ""

        var body: some View {
            SearchBarView(searchText: $searchText)
        }
    }
}
