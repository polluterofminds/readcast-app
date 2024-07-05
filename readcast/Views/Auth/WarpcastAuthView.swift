//
//  WarpcastAuthView.swift
//  readcast
//
//  Created by Justin Hunter on 7/5/24.
//

import SwiftUI

struct WarpcastAuthView: View {
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var appLifecycleWatcher: AppLifecycleWatcher
    @State public var gettingLink: Bool = false
    @State public var polling: Bool = false
    @State public var link: String = ""
    @State public var attempts: Int = 0
    @State public var pollingToken: String = ""
    @State public var signInError: Bool = false
    @State public var emailAuth: Bool = false
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var offset: CGFloat = 0
    
    let MAX_ATTEMPTS = 30
    
    func poll(token: String) {
        print("Polling...", Date())
        if attempts < 30 {
            attempts = attempts + 1
            UserManager.shared.pollWarpcast(token: token) { result in
                switch result {
                case.success(let pollResult):
                    if pollResult.data.result.signedKeyRequest.state == "completed" {
                        //  Need to store the FID here
                        attempts = 0
                        DispatchQueue.main.async {
                            presentationMode.wrappedValue.dismiss()
                        }
                    } else {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                            self.poll(token: token)
                        }
                    }
                    break
                case.failure(let error):
                    attempts = 0
                    polling = false
                    signInError = true
                    print("Failed to poll: \(error)")
                    break
                }
            }
        } else {
            attempts = 0
            polling = false
            signInError = true
        }
    }
    
    func logUserOut() {
        UserManager.shared.logOut()
    }
    
    func authenticate() {
        gettingLink = true
        UserManager.shared.signIn() { result in
            switch result {
            case .success(let signerDetails):
                print(signerDetails)
                if signerDetails.data.status != "completed" {
                    //  Using polling token
                    polling = true
                    link = signerDetails.data.deepLinkURL
                    pollingToken = signerDetails.data.token
                    gettingLink = false
                }
                break
            case .failure(let error):
                gettingLink = false
                polling = false
                print("Failed to sign in: \(error)")
            }
        }
    }
    
    func openWarpcast() {
        poll(token: pollingToken)
        guard let url = URL(string: link) else { return }
        UIApplication.shared.open(url)
    }
    
    func getUserInfo() async {
        let authStatus: AuthStatus = await UserManager.shared.getAuthStatus()
        let signerApproved: Bool = authStatus.isLoggedIn && authStatus.isWarpcast
        if !signerApproved && polling && pollingToken != "" {
            poll(token: pollingToken)
        }
    }
    
    var body: some View {
        VStack {
            if link != "" && !signInError {
                Button(action: openWarpcast) {
                    Text("Approve in Warpcast")
                        .foregroundColor(hexToColor(hex: "#CEFF41"))
                        .fontWeight(.bold)
                        .font(Font.custom(ConfigManager.shared.primaryFont, size: 18))
                        .background(.black)
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 10)
                .background(Color.black)
                .foregroundColor(.yellow)
                .cornerRadius(10)
            } else if !signInError {
                Button(action: authenticate) {
                    Text(gettingLink ? "Here we go..." : "Sign in with Warpcast")
                        .foregroundColor(hexToColor(hex: "#CEFF41"))
                        .fontWeight(.bold)
                        .font(Font.custom(ConfigManager.shared.primaryFont, size: 12))
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 10)
                .background(Color.black)
                .foregroundColor(.yellow)
                .cornerRadius(10)
                
            } else {
                Text("Error signing in")
                    .foregroundColor(.black)
                Button (action: {
                    polling = false
                    signInError = false
                    link = ""
                }) {
                    Text("Try again")
                        .underline()
                        .foregroundColor(.black)
                        .font(.system(size: 18))
                        .padding(.bottom, 5)
                        .foregroundColor(.black)
                }
            }
        }
        .offset(y: offset)
        .onAppear {
            Task {
                await getUserInfo()
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillShowNotification)) { notification in
            if let keyboardFrame = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect {
                offset = -keyboardFrame.height / 2
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillHideNotification)) { _ in
            offset = 0
        }
    }
}

#Preview {
    WarpcastAuthView()
}

