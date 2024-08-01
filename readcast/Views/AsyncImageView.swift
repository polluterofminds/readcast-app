//
//  AsyncImageView.swift
//  readcast
//
//  Created by Justin Hunter on 3/11/24.
//

import SwiftUI
import SDWebImage
import SDWebImageSwiftUI

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
    @Binding public var imageUrl: String
    @State public var circle: Bool?
    @State public var fallback: String
    @State public var width: CGFloat
    @State public var height: CGFloat
    
    var body: some View {
        if imageUrl != nil || imageUrl != "" {
            WebImage(url: URL(string: imageUrl)) { image in
                    image.resizable() // Control layout like SwiftUI.AsyncImage, you must use this modifier or the view will use the image bitmap size
                } placeholder: {
                    Image(systemName: fallback)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: width, height: height)
                }
                // Supports options and context, like `.delayPlaceholder` to show placeholder only when error
                .onSuccess { image, data, cacheType in
                    // Success
                    // Note: Data exist only when queried from disk cache or network. Use `.queryMemoryData` if you really need data
                }
                .indicator(.activity) // Activity Indicator
                .transition(.fade(duration: 0.5)) // Fade Transition with duration
                .frame(width: width, height: height)
                .if(circle ?? false) { $0.clipShape(Circle()) }
        } else {
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
}

#Preview {
    AsyncImageView(imageUrl: .constant("https://nokiatech.github.io/heif/content/images/ski_jump_1440x960.heic"), circle: true, fallback: "book", width: 40, height: 60)
}
