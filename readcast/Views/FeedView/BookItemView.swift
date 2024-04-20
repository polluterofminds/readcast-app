//
//  BookView.swift
//  readcast
//
//  Created by Justin Hunter on 3/11/24.
//

import SwiftUI

struct BookItemView: View {
    @State public var book: Book
    var body: some View {
        HStack(alignment: .top) {
            NavigationLink(destination: BookView(book: book)) {
                AsyncImageView(imageUrl: book.thumbnail ?? "", fallback: "book", width: 100, height: 150)
                VStack(alignment: .leading, content: {
                    Text(book.categories ?? "")
                        .lineLimit(1)
                        .font(.system(size: 14))
                    Text(book.title ?? "")
                        .lineLimit(1)
                        .font(.system(size: 18))
                        .fontWeight(.bold)
                    Text(book.author ?? "")
                        .lineLimit(1)
                        .font(.caption)
                    Text(book.description ?? "")
                        .multilineTextAlignment(.leading)
                        .lineLimit(4)
                        .font(.caption2)
                        .padding(.top, 2)
                    HStack {
                        Image(systemName: "text.bubble")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 16, height: 16)
                        Text(String(book.reviews ?? 0))
                            .font(.caption)
                    }.padding(.top, 4)
                })
            }.padding()
        }
        .foregroundColor(.black)        
    }
}

#Preview {
    BookItemView(book: Book(id: "31177c58-c61f-4fd5-a244-fd75a7c843fd", author: "Cixin Liu", categories: "Fiction", createdAt: "2024-01-27T16:49:16.530753+00:00", description: "Soon to be a Netflix Original Series! An NPR Best Book of the Decade Winner of the Hugo Award for Best Novel “War of the Worlds for the 21st century.” – Wall Street Journal The Three-Body Problem is the first chance for English-speaking readers to experience the Hugo Award-winning phenomenon from China's most beloved science fiction author, Liu Cixin. Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens. An alien civilization on the brink of destruction captures the signal and plans to invade Earth. Meanwhile, on Earth, different camps start forming, planning to either welcome the superior beings and help them take over a world seen as corrupt, or to fight against the invasion. The result is a science fiction masterpiece of enormous scope and vision. The Three-Body Problem Series The Three-Body Problem The Dark Forest Death's End Other Books Ball Lightning Supernova Era To Hold Up The Sky (forthcoming) At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.", thumbnail: "https://books.google.com/books/content?id=ZrNzAwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api", title: "The Three-Body Problem", reviews: 12, titleAuthorKey: ""))
}
