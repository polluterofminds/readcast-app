//
//  SignInWithAppleView.swift
//  readcast
//
//  Created by Justin Hunter on 7/5/24.
//

import SwiftUI
import AuthenticationServices
import Supabase
import GoTrue

struct SignInWithAppleView: View {
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        SignInWithAppleButton { request in
            request.requestedScopes = [.email, .fullName]
        } onCompletion: { result in
            Task {
                do {
                    guard let credential = try result.get().credential as? ASAuthorizationAppleIDCredential
                    else {
                        return
                    }
                    
                    guard let idToken = credential.identityToken
                        .flatMap({ String(data: $0, encoding: .utf8) })
                    else {
                        return
                    }
                    try await UserManager.shared.client.auth.signInWithIdToken(
                        credentials: .init(
                            provider: .apple,
                            idToken: idToken
                        )
                    )
                    
                    if UserManager.shared.client.auth.currentSession != nil {
                        Task {
                            await DBManager.shared.upsertUser()
                        }
                        DispatchQueue.main.async {
                            presentationMode.wrappedValue.dismiss()
                        }
                    }
                } catch {
                    dump(error)
                }
            }
        }
        .frame(width: 200, height: 40)
    }
}

#Preview {
    SignInWithAppleView()
}
