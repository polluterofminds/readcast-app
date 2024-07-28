//
//  StaticProfileView.swift
//  readcast
//
//  Created by Justin Hunter on 7/10/24.
//

import SwiftUI

struct StaticProfileView: View {
    @Binding public var user: DBUser
    @State public var profileImageUrl = ""
    var deleteAccount: () -> Void
    @State var isDeleteAccountPresented = false
    
    var body: some View {
        VStack {
            HStack {
                AsyncImageView(imageUrl: $profileImageUrl, fallback: "person", width: 75, height: 75)
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
            if !UserManager.shared.authStatus.isWarpcast {
                Button(action:{
                    isDeleteAccountPresented = true
                }) {
                    HStack {
                        Image(systemName: "exclamationmark.triangle")
                        Text("Delete account")
                    }
                }
                .padding(.top, 15)
                .foregroundColor(.red)
                .font(.system(size: 12))
            }
        }
        .padding(.top)
        .background(.white)
        .onAppear {
            print("Initial value")
            print(user.pfp)
            profileImageUrl = user.pfp ?? ""
        }
        .onChange(of: user.pfp) { newValue in
            print("PFP updated")
            print(newValue)
            profileImageUrl = newValue ?? ""
        }
        .alert("Deleting your account will remove all data and access. Are you sure?",
            isPresented: $isDeleteAccountPresented) {
            Button(action: deleteAccount) {
                Text("Yes, delete")
            }
            Button(action: {
                isDeleteAccountPresented = false
            }) {
                Text("Cancel")
            }
          }
    }
}

struct StaticProfileView_Previews: PreviewProvider {
    static var previews: some View {
        StaticProfileView(
            user: .constant(DBUser(
                email_address: "justin.edward.hunter@protonmail.com",
                id: nil,
                app_user: nil,
                display_name: "",
                username: "justinhunter",
                pfp: "https://readcast.mypinata.cloud/ipfs/bafkreic5xlhkxitqe4yvo2ffl24vvciadxwqizdvsyn4thzkfibgbkzr6a",
                bio: nil,
                fid: nil
            )),
            deleteAccount: mockDelete
        )
    }
    
    static func mockDelete() {
        print("Deleting...")
    }
}

