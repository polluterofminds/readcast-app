//
//  ContentView.swift
//  readcast
//
//  Created by Justin Hunter on 12/26/23.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationStack {
            VStack {
                HomeHeaderView()
                BookFeedView()
                Spacer()
                //  Bottom nav
            }
        }
    }
}

#Preview {
    ContentView()
}
