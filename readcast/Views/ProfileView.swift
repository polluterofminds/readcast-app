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
    @State public var user: DBUser = DBUser(email_address: "", id: nil, app_user: nil, display_name: "", username: nil, pfp_url: nil, bio: nil, fid: nil)
    func logUserOut() async {
        print("Logging out...")
        let authStatus = await UserManager.shared.getAuthStatus()
        UserManager.shared.logOut()
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
        if UserManager.shared.authStatus.isWarpcast {
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
        } else {
            Task {
                let userData = await DBManager.shared.getUser()
                user = userData
            }
        }
    }
    var body: some View {
        ZStack {
            Color.white
            VStack {
                if loading {
                    Spacer()
                    ZStack {
                        Color.black
                            .frame(width: 50, height: 50)
                            .cornerRadius(100)
                        ProgressView()
                    }
                    Spacer()
                } else {
                    VStack {
                        HStack {
                            AsyncImageView(imageUrl: user.pfp_url ?? "", fallback: "person", width: 75, height: 75)
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
                        .cornerRadius(0)
                }
                .padding(.bottom)
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
        .ignoresSafeArea()
    }
}

#Preview {
    ProfileView()
}
