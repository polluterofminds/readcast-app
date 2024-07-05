//
//  HomeHeaderView.swift
//  readcast
//
//  Created by Justin Hunter on 3/12/24.
//

import SwiftUI

struct HomeHeaderView: View {
    @State public var user: User = User(fid: 0, custodyAddress: "", recoveryAddress: "", followingCount: 0, followerCount: 0, verifications: [], bio: "", displayName: "", pfpURL: "", username: "", powerBadgeUser: false)
    @State public var greeting: String = "Good Morning"
    @State public var authStatus: AuthStatus = AuthStatus(isLoggedIn: false, isWarpcast: false)
    func getTimeOfDay() {
        let date = Date()
        let calendar = Calendar.current
        let hour = calendar.component(.hour, from: date)
        
        switch hour {
        case 0..<12:
            greeting = "Good Morning"
            return
        case 12..<17:
            greeting = "Good Afternoon"
            return
        default:
            greeting = "Good Evening"
            return
        }
    }
    
    func isAuthenticated() async {
        authStatus = await UserManager.shared.getAuthStatus()
        print("auth status: ", authStatus)
        if authStatus.isLoggedIn && authStatus.isWarpcast {
            //  Get User Info
            UserManager.shared.getUserInfo() { result in
                switch result {
                case.success(let userDetails):
                    print(userDetails)
                    user = userDetails
                    break
                case.failure(let error):
                    print("Failed to get user: \(error)")
                    break
                }
            }
        } else if authStatus.isLoggedIn {
            let session = UserManager.shared.session
            print(session)
        }
    }
    
    var body: some View {
        HStack {
            Text(greeting)
                .foregroundColor(.black)
                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                .font(Font.custom(ConfigManager.shared.primaryFont, size: 22))
            Spacer()
            if authStatus.isLoggedIn {
                NavigationLink(destination: ProfileView()) {
                    AsyncImageView(imageUrl: user.pfpURL, fallback: "gear", width: 30, height: 30).foregroundColor(.black)
                        .clipShape(Circle())                        
                }
            } else {
                NavigationLink(destination: AuthView()){
                    AsyncImageView(imageUrl: "", fallback: "person", width: 30, height: 30).foregroundColor(.black)
                        .clipShape(Circle())
                        .padding(3)
                        .overlay(
                            RoundedRectangle(cornerRadius: 100)
                                .stroke(Color.black, lineWidth: 2)
                        )
                }
            }
        }
        .padding(.horizontal)
        .padding(.bottom, 5)
        .padding(.vertical)
        .foregroundColor(.white)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [hexToColor(hex: "#CEFF41"), .white]),
                startPoint: .top,
                endPoint: .bottom 
            )
        )
        .onAppear {
            getTimeOfDay()
            Task {
                await isAuthenticated()
            }
        }
        .overlay(Rectangle().frame(height: 1).foregroundColor(Color.black), alignment: .bottom)
    }
}

#Preview {
    HomeHeaderView()
}
