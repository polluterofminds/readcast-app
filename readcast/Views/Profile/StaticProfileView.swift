//
//  StaticProfileView.swift
//  readcast
//
//  Created by Justin Hunter on 7/10/24.
//

import SwiftUI

struct StaticProfileView: View {
    @Binding public var user: DBUser
    var body: some View {
        VStack {
            HStack {
                AsyncImageView(imageUrl: user.pfp ?? "", fallback: "person", width: 75, height: 75)
                    .clipShape(Circle())
                    .padding(.horizontal)
                VStack(alignment: .leading) {
                    Text(user.display_name ?? "Hi")
                        .foregroundColor(.black)
                    Text("@\(user.username ?? "")")
                        .foregroundColor(.black)
                }
                Spacer()
            }
            VStack {
                Text(user.bio ?? "")
                    .foregroundColor(.black)
                    .padding()
            }
        }
        .padding(.top)
        .background(.white)
    }
}

#Preview {
    StaticProfileView(user: .constant(DBUser(email_address: "justin.edward.hunter@protonmail.com", id: nil, app_user: nil, display_name: "", username: "justinhunter", pfp: "https://readcast.mypinata.cloud/ipfs/bafkreic5xlhkxitqe4yvo2ffl24vvciadxwqizdvsyn4thzkfibgbkzr6a", bio: nil, fid: nil)))
}
