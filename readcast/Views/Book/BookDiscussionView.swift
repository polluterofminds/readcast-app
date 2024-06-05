//
//  BookDsicussionView.swift
//  readcast
//
//  Created by Justin Hunter on 3/17/24.
//

import SwiftUI

struct BookDiscussionView: View {
    @State public var book: Book
    @Binding public var reviews: [ReviewItem]
    @Binding public var reviewsLoading: Bool
    let loadReviews: (Book) -> Void
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                ForEach(reviews, id: \.id) { review in
                    ReviewItemView(book: book, review: review, loadReviews: loadReviews)
                }
            }
        }
        .padding(.horizontal)       
    }
}

//#Preview {
//    BookDiscussionView(book: Book(id: "31177c58-c61f-4fd5-a244-fd75a7c843fd", author: "Cixin Liu", categories: "Fiction", createdAt: "2024-01-27T16:49:16.530753+00:00", description: "Soon to be a Netflix Original Series! An NPR Best Book of the Decade Winner of the Hugo Award for Best Novel “War of the Worlds for the 21st century.” – Wall Street Journal The Three-Body Problem is the first chance for English-speaking readers to experience the Hugo Award-winning phenomenon from China's most beloved science fiction author, Liu Cixin. Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens. An alien civilization on the brink of destruction captures the signal and plans to invade Earth. Meanwhile, on Earth, different camps start forming, planning to either welcome the superior beings and help them take over a world seen as corrupt, or to fight against the invasion. The result is a science fiction masterpiece of enormous scope and vision. The Three-Body Problem Series The Three-Body Problem The Dark Forest Death's End Other Books Ball Lightning Supernova Era To Hold Up The Sky (forthcoming) At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.", thumbnail: "https://books.google.com/books/content?id=ZrNzAwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api", title: "The Three-Body Problem", reviews: 12, titleAuthorKey: ""), reviews: [ReviewItem(id: "", timestamp: "", title: "", review: "", created_at: "", fid: 2823, book_uuid: "")], reviewsLoading: false)
//}
