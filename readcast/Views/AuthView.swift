//
//  AuthView.swift
//  readcast
//
//  Created by Justin Hunter on 3/23/24.
//

import SwiftUI

struct CustomTextFieldStyle: TextFieldStyle {
    var backgroundColor: Color = .white
    var cornerRadius: CGFloat = 8
    var borderColor: Color = .gray
    var borderWidth: CGFloat = 1

    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(10)
            .background(backgroundColor)
            .cornerRadius(cornerRadius)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
            .foregroundColor(.black)
            .padding(.horizontal, 10)
    }
}

struct AuthView: View {
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
    
    func getUserInfo() {
        let signerApproved: Bool = UserManager.shared.getAuthStatus()
        if !signerApproved && polling && pollingToken != "" {
            poll(token: pollingToken)
        }
    }
    
    func setEmail() {
        emailAuth.toggle()
    }
    
    func signInWithEmail() {
        UserManager.shared.signInEmail(email: email, password: password) { result in
            switch result {
            case .success(let signerDetails):
                print("Signed in")
                DispatchQueue.main.async {
                    presentationMode.wrappedValue.dismiss()
                }
                break
            case .failure(let error):
                print("Failed to sign in: \(error)")
            }
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
                Text("Build your reading list.")
                    .font(.system(size: 20))
                    .foregroundColor(.black)
                VStack {
                    if emailAuth {
                        VStack {
                            Spacer()
                            Text("Email")
                                .frame(alignment: .leading)
                                .foregroundColor(.black)
                            TextField("", text: $email)
                                .frame(maxWidth: .infinity) // Ensures it stretches
                                .frame(width: UIScreen.main.bounds.width * 0.75)
                                .textFieldStyle(CustomTextFieldStyle())
                            Text("Password")
                                .frame(alignment: .leading)
                                .foregroundColor(.black)
                                .padding(.top)
                            SecureField("", text: $password)
                                .onSubmit {
                                    signInWithEmail()
                                }
                                .submitLabel(.send)
                                .frame(maxWidth: .infinity) // Ensures it stretches
                                .frame(width: UIScreen.main.bounds.width * 0.75)
                                .textFieldStyle(CustomTextFieldStyle())
                            Button(action: signInWithEmail) {
                                Text(gettingLink ? "Here we go..." : "Get Started")
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
                            Text("Or")
                                .foregroundColor(.black)
                                .padding(.top)
                                .font(.system(size: 12))
                            Button(action: setEmail) {
                                Text("Log in with Warpcast")
                            }
                            .foregroundColor(.black)
                        }
                        .padding()
                    } else if link != "" && !signInError {
                        Spacer()
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
                        Spacer()
                        Button(action: authenticate) {
                            Text(gettingLink ? "Here we go..." : "Get Started")
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
                        Text("Or")
                            .foregroundColor(.black)
                            .padding(.top)
                            .font(.system(size: 12))
                        Button(action: setEmail) {
                            Text("Log in with email (beta)")
                        }
                        .foregroundColor(.black)
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
                    Text("Powered by Pinata")
                        .font(.system(size: 12))
                        .padding(.bottom)
                }
                .offset(y: offset)
            }
            .onAppear {
                getUserInfo()
            }
            .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillShowNotification)) { notification in
                if let keyboardFrame = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect {
                    offset = -keyboardFrame.height / 2
                }
            }
            .onReceive(NotificationCenter.default.publisher(for: UIResponder.keyboardWillHideNotification)) { _ in
                offset = 0
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
    
//    var body: some View {
//            ZStack {
//                // Background image
//                GeometryReader { geometry in
//                    Image("AuthScreenBG")
//                        .resizable()
//                        .aspectRatio(contentMode: .fill)
//                        .frame(width: geometry.size.width, height: geometry.size.height)
//                        .clipped()
//                        .edgesIgnoringSafeArea(.all)
//                }
//                Text("Build your reading list.")
//                    .font(.system(size: 20))
//                    .foregroundColor(.black)
//                VStack {
//                    if emailAuth {
//                        VStack {
//                            Spacer()
//                            Text("Email")
//                                .frame(alignment: .leading)
//                                .foregroundColor(.black)
//                            TextField("Enter email here", text: $email)
//                                .frame(maxWidth: .infinity) // Ensures it stretches
//                                .frame(width: UIScreen.main.bounds.width * 0.75)
//                                .textFieldStyle(CustomTextFieldStyle())
//                            Text("Password")
//                                .frame(alignment: .leading)
//                                .foregroundColor(.black)
//                                .padding(.top)
//                            TextField("Enter password here", text: $password)
//                                .frame(maxWidth: .infinity) // Ensures it stretches
//                                .frame(width: UIScreen.main.bounds.width * 0.75)
//                                .textFieldStyle(CustomTextFieldStyle())
//                            Button(action: authenticate) {
//                                Text(gettingLink ? "Here we go..." : "Get Started")
//                                    .foregroundColor(hexToColor(hex: "#CEFF41"))
//                                    .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
//                                    .font(Font.custom(ConfigManager.shared.primaryFont, size: 18))
//                                    .background(.black)
//                            }
//                            .padding(.horizontal, 20)
//                            .padding(.vertical, 10)
//                            .background(Color.black)
//                            .foregroundColor(.yellow)
//                            .cornerRadius(10)
//                            Text("Or")
//                                .foregroundColor(.black)
//                                .padding(.top)
//                                .font(.system(size: 12))
//                            Button(action: setEmail) {
//                                Text("Log in with Warpcast")
//                            }
//                            .foregroundColor(.black)
//                        }
//                        .padding()
//                    } else if link != "" && !signInError {
//                        Spacer()
//                        Button(action: openWarpcast) {
//                            Text("Approve in Warpcast")
//                                .foregroundColor(hexToColor(hex: "#CEFF41"))
//                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
//                                .font(Font.custom(ConfigManager.shared.primaryFont, size: 18))
//                                .background(.black)
//                        }
//                        .padding(.horizontal, 20)
//                        .padding(.vertical, 10)
//                        .background(Color.black)
//                        .foregroundColor(.yellow)
//                        .cornerRadius(10)
//                    } else if !signInError {
//                        Spacer()
//                        Button(action: authenticate) {
//                            Text(gettingLink ? "Here we go..." : "Get Started")
//                                .foregroundColor(hexToColor(hex: "#CEFF41"))
//                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
//                                .font(Font.custom(ConfigManager.shared.primaryFont, size: 18))
//                                .background(.black)
//                        }
//                        .padding(.horizontal, 20)
//                        .padding(.vertical, 10)
//                        .background(Color.black)
//                        .foregroundColor(.yellow)
//                        .cornerRadius(10)
//                        Text("Or")
//                            .foregroundColor(.black)
//                            .padding(.top)
//                            .font(.system(size: 12))
//                        Button(action: setEmail) {
//                            Text("Log in with email (beta)")
//                        }
//                        .foregroundColor(.black)
//                    } else {
//                        Text("Error signing in")
//                            .foregroundColor(.black)
//                        Button (action: {
//                            polling = false
//                            signInError = false
//                            link = ""
//                        }) {
//                            Text("Try again")
//                                .underline()
//                                .foregroundColor(.black)
//                                .font(.system(size: 18))
//                                .padding(.bottom, 5)
//                                .foregroundColor(.black)
//                        }
//                    }
//                    Text("Powered by Pinata")
//                        .font(.system(size: 12))
//                        .padding(.bottom)
//                    
//                }
//            }
//            .onAppear {
//                getUserInfo()
//            }
//            .edgesIgnoringSafeArea(.all)
//            .navigationBarTitle("", displayMode: .inline)
//            .navigationBarHidden(true)
//            .navigationBarBackButtonHidden(true)
//            .overlay(
//                HStack {
//                    Button(action: {
//                        self.presentationMode.wrappedValue.dismiss()
//                    }) {
//                        Image(systemName: "chevron.left")
//                            .aspectRatio(contentMode: .fit)
//                            .foregroundColor(.black)
//                            .padding()
//                    }
//                    Spacer()
//                },
//                alignment: .topLeading
//            )
//        }
}

#Preview {
    AuthView()
}
