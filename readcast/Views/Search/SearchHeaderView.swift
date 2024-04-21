//
//  SearchHeaderView.swift
//  readcast
//
//  Created by Justin Hunter on 4/1/24.
//

import SwiftUI

struct SearchHeaderView: View {
    @Environment(\.presentationMode) var presentationMode
    var body: some View {
        HStack {
            Button(action: {
                self.presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "chevron.left")
                    .foregroundColor(.black)
                    .padding(.horizontal)
            }
            Spacer()
            Spacer()
        }
        .background(.white)
    }
}

#Preview {
    SearchHeaderView()
}
