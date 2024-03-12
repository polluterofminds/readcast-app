//
//  AsyncImageView.swift
//  readcast
//
//  Created by Justin Hunter on 3/11/24.
//

import SwiftUI

struct AsyncImageView: View {
    @State public var imageUrl: String
    @State public var fallback: String
    @State public var width: CGFloat
    @State public var height: CGFloat
    var body: some View {
        AsyncImage(url: URL(string: imageUrl)) { phase in
            if imageUrl != "", let image = phase.image {
            image
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: width, height: height)
            } else if phase.error != nil {
                Image(systemName: fallback)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: width, height: height)
                    .padding()
            } else {
                Image(systemName: fallback)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: width, height: height)
            }
        }
    }
}

#Preview {
    AsyncImageView(imageUrl: "", fallback: "book", width: 40, height: 60)
}
