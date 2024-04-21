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
        VStack {
            NavigationLink(destination: BookView(book: book)) {
                HStack {
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
                    Spacer()
                }
            }.padding()
            .foregroundColor(.black)
        }
        .background(.white)
    }
}

#Preview {
    BookItemView(book: Book(id: "31177c58-c61f-4fd5-a244-fd75a7c843fd", author: "Cixin Liu", categories: "Fiction", createdAt: "2024-01-27T16:49:16.530753+00:00", description: "Book descriptions with a lot of text were never a problem, so let's see if I fixed it with this change. I don't know though.", thumbnail: "https://books.google.com/books/content?id=ZrNzAwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api", title: "The Three-Body Problem", reviews: 12, titleAuthorKey: ""))
}
