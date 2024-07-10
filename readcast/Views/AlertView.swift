//
//  AlertView.swift
//  readcast
//
//  Created by Justin Hunter on 7/10/24.
//

import SwiftUI

struct ReusableAlertView<Content: View>: View {
    @Binding var isPresented: Bool
    @Binding var title: String
    @Binding var message: String
    @Binding var primaryButtonTitle: String
    let primaryButtonAction: () -> Void
    let secondaryButtonTitle: String?
    let secondaryButtonAction: (() -> Void)?
    let content: () -> Content
    
    var body: some View {
        content()
            .alert(isPresented: $isPresented) {
                if let secondaryButtonTitle = secondaryButtonTitle, let secondaryButtonAction = secondaryButtonAction {
                    return Alert(
                        title: Text(title),
                        message: Text(message),
                        primaryButton: .default(Text(primaryButtonTitle), action: primaryButtonAction),
                        secondaryButton: .cancel(Text(secondaryButtonTitle), action: secondaryButtonAction)
                    )
                } else {
                    return Alert(
                        title: Text(title),
                        message: Text(message),
                        dismissButton: .default(Text(primaryButtonTitle), action: primaryButtonAction)
                    )
                }
            }
    }
}

struct ReusableAlertView_Previews: PreviewProvider {
    static var previews: some View {
        ReusableAlertView(
            isPresented: .constant(true),
            title: .constant("Alert Title"),
            message: .constant("This is an alert message."),
            primaryButtonTitle: .constant("OK"),
            primaryButtonAction: { print("Primary button tapped") },
            secondaryButtonTitle: nil,
            secondaryButtonAction: { print("Secondary button tapped") },
            content: { Text("Content") }
        )
    }
}
