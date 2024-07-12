//
//  ProfileHeaderButtonView.swift
//  readcast
//
//  Created by Justin Hunter on 7/10/24.
//

import SwiftUI

struct ProfileHeaderSaveButtonView: View {
    var showSaveButton: Bool
    @Binding var username: String
    @Binding var initialUsername: String
    @Binding var showAlert: Bool
    
    var saveProfileInfo: () async -> Void
    
    var body: some View {
        if showSaveButton {
            Button(action: {
                Task {
                    let trimmedUsername = username.trimmingCharacters(in: .whitespacesAndNewlines)
                    let trimmedInitialUsername = initialUsername.trimmingCharacters(in: .whitespacesAndNewlines)
                    
                    if trimmedUsername != trimmedInitialUsername {
                        //  Check if username is taken
                        let available = await DBManager.shared.isUsernameAvailable(username: username)
                        if available {
                            await saveProfileInfo()
                        } else {
                            // display error
                            showAlert = true
                        }
                    } else {
                        await saveProfileInfo()      
                    }
                }
            }) {
                Text("Save")
                    .foregroundColor(.white)
                    .padding()
                    .background(.gray)
                    .cornerRadius(10)
            }
            .background(.white)
        } else {
            Spacer()
        }
    }
}

#Preview {
    func mockSaveFunction() {
        Task {
            await asyncMockSaveFunction()
        }
    }
    
    @Sendable func asyncMockSaveFunction() async {
        print("Save")
    }
    return ProfileHeaderSaveButtonView(showSaveButton: false, username: .constant("justinhunter"), initialUsername: .constant("justinhunter"), showAlert: .constant(false), saveProfileInfo: mockSaveFunction)
}
