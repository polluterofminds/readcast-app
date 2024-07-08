//
//  SwipeToDeleteView.swift
//  readcast
//
//  Created by Justin Hunter on 7/8/24.
//

import SwiftUI

struct SwipeToDeleteView<Content: View>: View {
    let content: Content
    let action: () -> Void
    @State private var offset: CGFloat = 0.0

    init(action: @escaping () -> Void, @ViewBuilder content: () -> Content) {
        self.action = action
        self.content = content()
    }

    var body: some View {
        ZStack(alignment: .leading) {
            HStack {
                Spacer()
                Button(action: action) {
                    Text("Delete")
                        .foregroundColor(.white)
                        .padding(.horizontal)
                        .background(Color.red)
                        .cornerRadius(10)
                }
            }
            .frame(maxWidth: .infinity)
            .background(Color.red)
            .cornerRadius(10)
            
            content
                .offset(x: offset)
                .gesture(
                    DragGesture()
                        .onChanged { gesture in
                            if gesture.translation.width < 0 {
                                offset = gesture.translation.width
                            }
                        }
                        .onEnded { _ in
                            if offset < -100 {
                                action()
                            }
                            withAnimation {
                                offset = 0
                            }
                        }
                )
        }
    }
}
