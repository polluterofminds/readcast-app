//
//  ShareSheetView.swift
//  readcast
//
//  Created by Justin Hunter on 7/31/24.
//

import SwiftUI

struct ShareSheet: View {
    let action : String
    var body: some View {
        if UIDevice.current.userInterfaceIdiom == .pad {
            Text("")
        } else {
            Button(action: { actionSheet(action: action) }) {
                HStack {
                    Text("Share")
                    Image(systemName: "square.and.arrow.up")
                        .foregroundColor(.gray)
                }
            }
        }
    }
    func actionSheet(action: String) {
        if UIDevice.current.userInterfaceIdiom == .pad {
            return
        } else {
            let av = UIActivityViewController(activityItems: [action], applicationActivities: nil)
            UIApplication.shared.windows.first?.rootViewController?.present(av, animated: true, completion: nil)
        }
    }
}

struct ShareSheet_Previews: PreviewProvider {
    static var previews: some View {
        ShareSheet(action: "Heyo")
    }
}
