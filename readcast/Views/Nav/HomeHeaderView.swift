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
    @State public var isLoggedIn: Bool = false
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
    
    func isAuthenticated() {
        isLoggedIn = UserManager.shared.getAuthStatus()
        print("is logged in: ", isLoggedIn)
        if isLoggedIn {
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
        }
    }
    
    var body: some View {
        HStack {
            Text(greeting)
                .foregroundColor(.black)
                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                .font(Font.custom(ConfigManager.shared.primaryFont, size: 26))
            Spacer()
            if isLoggedIn && user.pfpURL != "" {
                NavigationLink(destination: ProfileView()) {
                    AsyncImageView(imageUrl: user.pfpURL, fallback: "person", width: 30, height: 30).foregroundColor(.black)
                        .clipShape(Circle())
                }
            } else {
                NavigationLink(destination: AuthView()){
                    AsyncImageView(imageUrl: "", fallback: "person", width: 20, height: 20).foregroundColor(.black)
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
            isAuthenticated()
        }
        .overlay(Rectangle().frame(height: 1).foregroundColor(Color.black), alignment: .bottom)
    }
}

#Preview {
    HomeHeaderView()
}
