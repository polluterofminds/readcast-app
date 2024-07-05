//
//  CustomTextFieldView.swift
//  readcast
//
//  Created by Justin Hunter on 7/5/24.
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
