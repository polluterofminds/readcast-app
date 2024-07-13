import SwiftUI

struct ProfileView: View {
    @Environment(\.presentationMode) var presentationMode
    @State public var loading = false
    @State public var user: DBUser = DBUser(email_address: nil, id: nil, app_user: nil, display_name: "", username: "", pfp: nil, bio: nil, fid: nil)
    @State public var username = ""
    @State public var displayName = ""
    @State public var bio = ""
    @State private var ipfsHash: String = ""
    @State public var pfp: String = ""
    @State var initialUsername: String = ""
    @State var initialDisplayName: String = ""
    @State var initialBio: String = ""
    @State private var showAlert = false
    @State private var alertMessage = "Username is taken, please choose another"
    @State private var alertTitle = "Error"
    @State private var alertPrimaryButtonTitle = "OK"
    @State private var editProfile = false
    @State private var placeholderImage = ""
    
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
                print("getting user data")
                let userData = await DBManager.shared.getUser()
                user = userData
                print(userData)
                pfp = userData.pfp ?? ""
            }
        }
    }
    
    private var showSaveButton: Bool {
        return username != initialUsername || displayName != initialDisplayName || bio != initialBio || ipfsHash != ""
    }
    
    func saveProfileInfo() async {
        print("Bio \(bio)")
        var pfp_url = ""
        if pfp != "" {
            pfp_url = pfp
        } else if ipfsHash != "" {
            pfp_url = ConfigManager.shared.gatewayUrl + "/ipfs/" + ipfsHash
        }
        
        await DBManager.shared.upsertUserWithValues(username: username == "" ? nil : username, display_name: displayName, bio: bio, pfp_url: pfp_url)
        initialBio = bio
        initialUsername = username
        initialDisplayName = displayName
        ipfsHash = ""
        editProfile = false
    }
    
    var body: some View {
        ReusableAlertView(
            isPresented: $showAlert,
            title: $alertTitle,
            message: $alertMessage,
            primaryButtonTitle: $alertPrimaryButtonTitle,
            primaryButtonAction: { showAlert = false },
            secondaryButtonTitle: nil,
            secondaryButtonAction: nil
        ) {
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
                    } else if user.username == nil || editProfile == true {
                        UpdateProfileView(username: $username, displayName: $displayName, bio: $bio, ipfsHash: $ipfsHash, pfp: $pfp)
                    } else {
                        Spacer()
                        StaticProfileView(user: $user)
                            .onAppear {
                                getUserData()
                            }
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
                .background(Color.white)
                .navigationBarBackButtonHidden(true)
                .navigationBarItems(leading:
                                        Button(action: {
                    self.presentationMode.wrappedValue.dismiss()
                }) {
                    Image(systemName: "chevron.left")
                        .foregroundColor(.black)
                        .padding(.horizontal)
                },
                                    trailing:
                                        VStack {
                    if user.username == nil || editProfile == true {
                        ProfileHeaderSaveButtonView(showSaveButton: showSaveButton, username: $username, initialUsername: $initialUsername, showAlert: $showAlert, saveProfileInfo: saveProfileInfo)
                    } else if UserManager.shared.authStatus.isWarpcast != true {
                        Button(action: {
                            editProfile = true
                            username = user.username ?? ""
                            displayName = user.display_name ?? ""
                            bio = user.bio ?? ""
                            pfp = user.pfp ?? ""
                            initialUsername = user.username ?? ""
                            
                        }) {
                            AsyncImageView(imageUrl: $placeholderImage, fallback: "square.and.pencil", width: 30, height: 30).foregroundColor(.black)                                
                        }
                    }
                }
                )
            }
            .ignoresSafeArea()
        }
    }
}

#Preview {
    ProfileView()
}
