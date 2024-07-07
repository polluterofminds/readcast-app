//
//  ReviewItemView.swift
//  readcast
//
//  Created by Justin Hunter on 3/17/24.
//

import SwiftUI

struct ReviewItemView: View {
    @State public var book: Book
    @State public var review: ReviewItem
    let loadReviews: (Book) -> Void
    
    func loadReplies() {
        
    }
    
    func reportAndHide() {
        BookManager.shared.reportReview(review: review) { result in
            switch result {
            case .success(_):
                break
            case .failure(let error):
                print("Failed to fetch books: \(error)")
            }
        }
        UserManager.shared.storeReportedFid(fid: Int(review.fid))
        loadReviews(book)
    }
    
    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                AsyncImageView(imageUrl: review.users?.pfp ?? "", circle: true, fallback: "person", width: 30, height: 30)
                Text("@\(review.users?.username ?? "")")
                    .font(.system(size: 14))
                    .foregroundColor(.black)
            }
            VStack(alignment: .leading) {
                Text(review.review)
                    .font(.system(size: 14))
                    .foregroundColor(.black)
            }
            HStack {
                Spacer()
                Button(action: reportAndHide) {
                    Text("Report and hide")
                        .padding(.trailing)
                        .padding(.top)
                        .font(.system(size: 12))
                        .foregroundColor(.black)
                }
            }
        }
        .padding(.bottom, 10)
        .onAppear {
            loadReplies()
        }
        .background(.white)
    }
}

struct ReviewItemView_Previews: PreviewProvider {
    static var previews: some View {
        func loadReviewPlaceholder(book: Book) {
            print("loadReview called for book")
        }
        return ReviewItemView(
            book: Book(
                id: "31177c58-c61f-4fd5-a244-fd75a7c843fd",
                author: "Cixin Liu",
                categories: "Fiction",
                createdAt: "2024-01-27T16:49:16.530753+00:00",
                description: "Soon to be a Netflix Original Series! An NPR Best Book of the Decade Winner of the Hugo Award for Best Novel “War of the Worlds for the 21st century.” – Wall Street Journal The Three-Body Problem is the first chance for English-speaking readers to experience the Hugo Award-winning phenomenon from China's most beloved science fiction author, Liu Cixin. Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens. An alien civilization on the brink of destruction captures the signal and plans to invade Earth. Meanwhile, on Earth, different camps start forming, planning to either welcome the superior beings and help them take over a world seen as corrupt, or to fight against the invasion. The result is a science fiction masterpiece of enormous scope and vision. The Three-Body Problem Series The Three-Body Problem The Dark Forest Death's End Other Books Ball Lightning Supernova Era To Hold Up The Sky (forthcoming) At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.",
                thumbnail: "https://books.google.com/books/content?id=ZrNzAwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
                title: "The Three-Body Problem",
                reviews: 12,
                titleAuthorKey: ""
            ),
            review: ReviewItem(
                id: "f9c97d47-7ec9-4100-9b42-90531efd5b1a",
                timestamp: "2023-06-28T18:26:15.000Z",
                title: "The Three-Body Problem",
                review: "Started reading 3 Body Problem last week after years of wanting to read it",
                created_at: "2024-01-27T20:03:52.775517+00:00",
                fid: 7588.0,
                stars: nil,
                books: Book(
                    id: "31177c58-c61f-4fd5-a244-fd75a7c843fd",
                    author: "Cixin Liu",
                    categories: "Fiction",
                    createdAt: "2024-01-27T16:49:16.530753+00:00",
                    description: "Soon to be a Netflix Original Series! An NPR Best Book of the Decade Winner of the Hugo Award for Best Novel “War of the Worlds for the 21st century.” – Wall Street Journal The Three-Body Problem is the first chance for English-speaking readers to experience the Hugo Award-winning phenomenon from China's most beloved science fiction author, Liu Cixin. Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens. An alien civilization on the brink of destruction captures the signal and plans to invade Earth. Meanwhile, on Earth, different camps start forming, planning to either welcome the superior beings and help them take over a world seen as corrupt, or to fight against the invasion. The result is a science fiction masterpiece of enormous scope and vision. The Three-Body Problem Series The Three-Body Problem The Dark Forest Death's End Other Books Ball Lightning Supernova Era To Hold Up The Sky (forthcoming) At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.",
                    thumbnail: "https://books.google.com/books/content?id=ZrNzAwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
                    title: "The Three-Body Problem",
                    reviews: 12,
                    titleAuthorKey: ""
                ),
                hash: Optional("0xbaf3d9ad34ebc431633da3306157e2034d2d325c"),
                thread_hash: Optional("0xbaf3d9ad34ebc431633da3306157e2034d2d325c"),
                parent_hash: nil,
                book_uuid: "31177c58-c61f-4fd5-a244-fd75a7c843fd",
                weight: nil,
                users: Optional(readcast.ReviewUser(
                    fid: 716.0,
                    username: Optional("ayushm.eth"),
                    pfp: Optional("https://i.imgur.com/J7duv4f.jpg"),
                    bio: Optional("20. hacking @ https://www.spire.dev/ \npreviously intern Nethermind, epns.io"),
                    display_name: Optional("Ayush")
                ))
            ),
            loadReviews: loadReviewPlaceholder
        )
    }
}
