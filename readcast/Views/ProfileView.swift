//
//  ProfileView.swift
//  readcast
//
//  Created by Justin Hunter on 4/1/24.
//

import SwiftUI

struct ProfileView: View {
    @State public var isLoggedIn = true
    func logUserOut() {
        UserManager.shared.logOut()
        isAuthenticated()
    }
    func isAuthenticated() {
        isLoggedIn = UserManager.shared.getAuthStatus()
        print(isLoggedIn)
    }
    var body: some View {
        Text(/*@START_MENU_TOKEN@*/"Hello, World!"/*@END_MENU_TOKEN@*/)
        Button(action: logUserOut) {
            Text("Log out")
        }
    }
}

#Preview {
    ProfileView()
}
