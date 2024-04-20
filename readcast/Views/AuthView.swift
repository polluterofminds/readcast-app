//
//  AuthView.swift
//  readcast
//
//  Created by Justin Hunter on 3/23/24.
//

import SwiftUI

struct AuthView: View {
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var appLifecycleWatcher: AppLifecycleWatcher
    @State public var gettingLink: Bool = false
    @State public var polling: Bool = false
    @State public var link: String = ""
    @State public var attempts: Int = 0
    @State public var pollingToken: String = ""
    @State public var signInError: Bool = false
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
//                    poll(token: signerDetails.data.token)
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
    
    func getUserInfo() {
        let signerApproved: Bool = UserManager.shared.getAuthStatus()
        print("signer approved: ", signerApproved)
        print("polling", polling)
        print("polling token", pollingToken)
        if !signerApproved && polling && pollingToken != "" {
            poll(token: pollingToken)
        }
    }
    
    var body: some View {
            ZStack {
                // Background image
                GeometryReader { geometry in
                    Image("AuthScreenBG")
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: geometry.size.width, height: geometry.size.height)
                        .clipped()
                        .edgesIgnoringSafeArea(.all)
                }
                
                VStack {
                    Spacer()
                    Spacer()
                    Spacer()
                    Spacer()
                    Text("Build your reading list.")
                        .font(.system(size: 20))
                    Spacer()
                    Spacer()
                    if link != "" && !signInError {
                        Button(action: openWarpcast) {
                            Text("Approve in Warpcast")
                                .foregroundColor(hexToColor(hex: "#CEFF41"))
                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
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
                            Text(gettingLink ? "Here we go..." : "Get Started")
                                .foregroundColor(hexToColor(hex: "#CEFF41"))
                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                                .font(Font.custom(ConfigManager.shared.primaryFont, size: 18))
                                .background(.black)
                        }
                        .padding(.horizontal, 20)
                        .padding(.vertical, 10)
                        .background(Color.black)
                        .foregroundColor(.yellow)
                        .cornerRadius(10)
                    } else {
                        Text("Error signing in")
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
                        }
                    }
                    Text("Powered by Pinata")
                        .font(.system(size: 12))
                        .padding(.bottom)
                    
                }
            }
            .onAppear {
                getUserInfo()
            }
            .edgesIgnoringSafeArea(.all)
            .navigationBarTitle("", displayMode: .inline)
            .navigationBarHidden(true)
            .navigationBarBackButtonHidden(true)
            .overlay(
                HStack {
                    Button(action: {
                        self.presentationMode.wrappedValue.dismiss()
                    }) {
                        Image(systemName: "chevron.left")
                            .aspectRatio(contentMode: .fit)
                            .foregroundColor(.black)
                            .padding()
                    }
                    Spacer()
                },
                alignment: .topLeading
            )
        }
}

#Preview {
    AuthView()
}
