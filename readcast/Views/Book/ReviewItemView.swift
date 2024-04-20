//
//  ReviewItemView.swift
//  readcast
//
//  Created by Justin Hunter on 3/17/24.
//

import SwiftUI

struct ReviewItemView: View {
    @State public var review: ReviewItem
    
    func loadReplies() {
        
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
        }
        .padding(.bottom, 10)
        .onAppear {
            loadReplies()
        }
        .background(.white)
    }
}

#Preview {
    ReviewItemView(review: ReviewItem(id: "f9c97d47-7ec9-4100-9b42-90531efd5b1a", timestamp: "2023-06-28T18:26:15.000Z", title: "The Three-Body Problem", review: "Started reading 3 Body Problem last week after years of wanting to read it", created_at: "2024-01-27T20:03:52.775517+00:00", fid: 7588.0, stars: nil, books: nil, hash: Optional("0xbaf3d9ad34ebc431633da3306157e2034d2d325c"), thread_hash: Optional("0xbaf3d9ad34ebc431633da3306157e2034d2d325c"), parent_hash: nil, book_uuid: "31177c58-c61f-4fd5-a244-fd75a7c843fd", weight: nil, users: Optional(readcast.ReviewUser(fid: 716.0, username: Optional("ayushm.eth"), pfp: Optional("https://i.imgur.com/J7duv4f.jpg"), bio: Optional("20. hacking @ https://www.spire.dev/ \npreviously intern Nethermind, epns.io"), display_name: Optional("Ayush")))))
}
