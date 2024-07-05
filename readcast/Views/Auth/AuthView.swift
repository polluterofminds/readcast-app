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
    @State var showWarpcastOption = false
    
    
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
                Spacer()
                SignInWithAppleView()
                    .padding(.bottom)
                WarpcastAuthView()
                Text("By using ReadCast, you agree to the end user license agreement linked below.")
                    .font(.system(size: 10))
                    .foregroundColor(.black)
                    .padding([.top, .leading, .trailing])
                Link("EULA", destination: URL(string: "https://readcast.xyz/#text11")!)
                    .font(.system(size: 10))
                    .foregroundColor(.blue)
                    .padding(.bottom)
            }
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
