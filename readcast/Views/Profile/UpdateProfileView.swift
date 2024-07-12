import SwiftUI
import PhotosUI

struct UpdateProfileView: View {
    @Binding public var username: String
    @Binding public var displayName: String
    @Binding public var bio: String
    @Binding public var ipfsHash: String
    @Binding public var pfp: String
    @State private var isImagePickerPresented = false
    @State private var selectedImage: UIImage? = nil
    @State private var profileImage: UIImage? = nil
    
    var body: some View {
        VStack(alignment: .leading) {
            Spacer()
            HStack {
                Spacer()
                Text("Update Profile")
                    .foregroundColor(.black)
                    .font(.title2)
                Spacer()
            }
            HStack {
                Spacer()
                if let selectedImage = selectedImage {
                    Image(uiImage: selectedImage)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 90, height: 90)
                        .clipShape(Circle())
                        .onTapGesture {
                            isImagePickerPresented = true
                        }
                        .onAppear {
                            uploadImageToPinata(image: selectedImage) { hash in
                                DispatchQueue.main.async {
                                    self.ipfsHash = hash ?? ""
                                }
                            }
                        }
                } else if let profileImage = profileImage {
                    Image(uiImage: profileImage)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 90, height: 90)
                        .clipShape(Circle())
                        .onTapGesture {
                            isImagePickerPresented = true
                        }
                } else {
                    Image(systemName: "person.circle.fill")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 90, height: 90)
                        .foregroundColor(.gray)
                        .onTapGesture {
                            isImagePickerPresented = true
                        }
                }
                Spacer()
            }
            .padding(.bottom, 20)
            HStack {
                Text("Username")
                    .foregroundColor(.black)
                Spacer()
                TextField("username",
                          text: $username,
                          prompt: Text("Username")
                    .foregroundColor(.gray.opacity(0.5))
                )
                .padding(5)
                .autocapitalization(.none)
                .autocorrectionDisabled(true)
                .foregroundColor(.black)
                .frame(width: 200)
                .overlay(
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(.black)
                        .padding(.top, 35)
                )
            }
            HStack {
                Text("Name")
                    .foregroundColor(.black)
                Spacer()
                TextField("display name",
                          text: $displayName,
                          prompt: Text("Name")
                    .foregroundColor(.gray.opacity(0.5))
                )
                .padding(5)
                .foregroundColor(.black)
                .frame(width: 200)
                .overlay(
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(.black)
                        .padding(.top, 35)
                )
            }
            HStack {
                Text("Bio")
                    .foregroundColor(.black)
                Spacer()
                TextField("bio",
                          text: $bio,
                          prompt: Text("Bio")
                    .foregroundColor(.gray.opacity(0.5))
                )
                .padding(5)
                .foregroundColor(.black)
                .frame(width: 200)
                .overlay(
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(.black)
                        .padding(.top, 35)
                )
            }
            
            Spacer()
        }
        .onChange(of: pfp) { newValue, oldValue in
            print("Text changed from \(oldValue) to \(newValue)")
            loadProfileImage()
        }
        .onAppear {
            print(pfp)
            if pfp != "" {
                loadProfileImage()
            }
        }
        .background(.white)
        .padding(.horizontal)
        .sheet(isPresented: $isImagePickerPresented) {
            ImagePicker(image: $selectedImage)
        }
    }
    
    private func loadProfileImage() {
        guard let url = URL(string: pfp) else { return }
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let data = data, let image = UIImage(data: data) {
                DispatchQueue.main.async {
                    self.profileImage = image
                }
            }
        }.resume()
    }
}

#Preview {
    UpdateProfileView(username: .constant("polluterofminds"), displayName: .constant("Justin Hunter"), bio: .constant(""), ipfsHash: .constant(""), pfp: .constant("https://example.com/image.png"))
}
