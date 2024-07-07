//
//  BookActionView.swift
//  readcast
//
//  Created by Justin Hunter on 3/21/24.
//

import SwiftUI

struct StatusValue {
    let display: String
    let value: String
    let icon: String
}

struct BookActionView: View {
    @Binding public var libraryItem: LibraryItem
    @State public var options: [StatusValue]
    @Binding public var selectedStatus: StatusValue
    @State private var loggedIn: Bool = false
    @State private var isContextMenuVisible = false
    
    var updateStatus: (StatusValue) async -> Void
    
    func isAuthenticated() async {
        let auth: AuthStatus = await UserManager.shared.getAuthStatus()
        loggedIn = auth.isLoggedIn
    }
    
    var body: some View {
        HStack(spacing:0) {
            VStack {
                Text(selectedStatus.display)
                    .font(Font.custom(ConfigManager.shared.primaryFont, size: 12))
                    .textCase(/*@START_MENU_TOKEN@*/.uppercase/*@END_MENU_TOKEN@*/)
                    .foregroundColor(.black)
            }
            .padding(.horizontal, 5)
            .padding(.vertical, 2)
            if loggedIn != false {
                Menu {
                    ForEach(options, id: \.value) { option in
                        Button(action: {
                            Task {
                                await updateStatus(option)
                            }
                        }) {
                            Label(option.display, systemImage: option.icon)
                        }
                    }
                } label: {
                    Image(systemName: "chevron.down")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 16, height: 16)
                }
                .menuStyle(DefaultMenuStyle())
                .foregroundColor(.black)
                .frame(width: 40, height: 20)
                .padding(.horizontal, 0)
                .padding(.vertical, 4)
            } else {
                NavigationLink(destination: AuthView()) {
                    Image(systemName: "chevron.down")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 16, height: 16)
                }
                .foregroundColor(.black)
                .frame(width: 40, height: 20)
                .padding(.horizontal, 0)
                .padding(.vertical, 4)
            }
        }
        .onAppear {
            Task {
             await isAuthenticated()
            }
        }
        .background(
            LinearGradient(
                gradient: Gradient(colors: [hexToColor(hex: "#CEFF41"), .white]),
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .overlay(
            RoundedRectangle(cornerRadius: 0)
                .stroke(Color.black, lineWidth: 1)
        )
    }
}

//#Preview {
//    BookActionView()
//}
