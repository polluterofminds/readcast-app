//
//  ProfileView.swift
//  readcast
//
//  Created by Justin Hunter on 4/1/24.
//

import SwiftUI

struct ProfileView: View {
    @Environment(\.presentationMode) var presentationMode
    @State public var loading = true
    @State public var user: User = User(fid: 4823, custodyAddress: "0x7f9a6992a54dc2f23f1105921715bd61811e5b71", recoveryAddress: "0x00000000fcb080a4d6c39a9354da9eb9bc104cd7", followingCount: 891, followerCount: 24009, verifications: ["0x1612c6dff0eb5811108b709a30d8150495ce9cc5", "0xcdcdc174901b12e87cc82471a2a2bd6181c89392"], bio: "Writer. Building @pinatacloud. Tinkering with a Farcaster native alternative to GoodReads: https://readcast.xyz \\ https://polluterofminds.com", displayName: "Justin Hunter", pfpURL: "https://i.seadn.io/gae/lhGgt7yK1JiBVYz_HBxcAmYLRtP03aw5xKX4FgmFT9Ai7kLD5egzlLvb0lkuRNl28shtjr07DC8IHzLUkTqlWUMndUzC9R5_MSxH3g?w=500&auto=format", username: "polluterofminds", powerBadgeUser: true)
    func logUserOut() async {
        print("Logging out...")
        let authStatus = await UserManager.shared.getAuthStatus()
        print(authStatus)
        if authStatus.isWarpcast {
            UserManager.shared.logOut()
            DispatchQueue.main.async {
                self.presentationMode.wrappedValue.dismiss()
            }
        } else {
            do {
                try await UserManager.shared.client.auth.signOut()
                DispatchQueue.main.async {
                    self.presentationMode.wrappedValue.dismiss()
                }
            } catch {
                print("Could not log out of supabase session")
            }
        }
    }
    func getUserData() {
        UserManager.shared.getUserInfo() { result in
            switch result {
            case.success(let userData):
                user = userData
                loading = false
                break
            case.failure(let error):
                print("Failed to get user: \(error)")
                loading = false
                break
            }
        }
    }
    var body: some View {
        VStack {
            if loading {
                ProgressView()
                    .background(.white)
            } else {
                VStack {
                    HStack {
                        AsyncImageView(imageUrl: user.pfpURL, fallback: "person", width: 75, height: 75)
                            .clipShape(Circle())                            
                            .padding(.horizontal)
                        VStack(alignment: .leading) {
                            Text(user.displayName)
                                .foregroundColor(.black)
                            Text("@\(user.username)")
                                .foregroundColor(.black)
                        }
                        Spacer()
                    }
                    VStack {
                        Text(user.bio)
                            .foregroundColor(.black)
                            .padding()
                    }
                }
                .padding(.top)
                .background(.white)
            }
            Spacer()
            Button(action: {
                Task {
                    await logUserOut()
                }
            }) {
                Text("Log out")
                    .foregroundColor(.white)
                    .padding()
                    .background(.black)
                    .cornerRadius(10)
            }
        }
        .padding(.top, 20)
        .onAppear {
            getUserData()
        }
        .background(Color.white)
        .navigationBarBackButtonHidden(true)
        .navigationBarItems(leading:
                                SearchHeaderView()
        )
    }
}

#Preview {
    ProfileView()
}
