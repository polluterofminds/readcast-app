//
//  AsyncImageView.swift
//  readcast
//
//  Created by Justin Hunter on 3/11/24.
//

import SwiftUI

extension View {
    @ViewBuilder
    func `if`<Content: View>(_ condition: Bool, content: (Self) -> Content) -> some View {
        if condition {
            content(self)
        } else {
            self
        }
    }
}

struct AsyncImageView: View {
    @State public var imageUrl: String
    @State public var circle: Bool?
    @State public var fallback: String
    @State public var width: CGFloat
    @State public var height: CGFloat
    
    var body: some View {
        AsyncImage(url: URL(string: imageUrl)) { phase in
            if imageUrl != "", let image = phase.image {
            image
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: width, height: height)
                .if(circle ?? false) { $0.clipShape(Circle()) }
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
