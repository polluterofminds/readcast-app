//
//  HomeHeaderView.swift
//  readcast
//
//  Created by Justin Hunter on 3/12/24.
//

import SwiftUI

struct HomeHeaderView: View {
    @State public var greeting: String = "Good Morning"
    func getTimeOfDay() {
        let date = Date()
        let calendar = Calendar.current
        let hour = calendar.component(.hour, from: date)
        print(hour)
        switch hour {
        case 0..<12:
            greeting = "Good Morning"
            return
        case 12..<17:
            greeting = "Good Afternoon"
            return
        default:
            greeting = "Good Evening"
            return
        }
    }
    var body: some View {
        HStack {
            Text(greeting)
                .foregroundColor(.black)
                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                .font(Font.custom(ConfigManager.shared.primaryFont, size: 26))
            Spacer()
            AsyncImageView(imageUrl: "", fallback: "person", width: 20, height: 20).foregroundColor(.black)
        }
        .padding(.horizontal)
        .padding(.bottom, 5)
        .padding(.vertical)
        .foregroundColor(.white)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [hexToColor(hex: "#CEFF41"), .white]),
                startPoint: .top,
                endPoint: .bottom 
            )
        )
        .onAppear {
            getTimeOfDay()
        }
        .overlay(Rectangle().frame(height: 1).foregroundColor(Color.black), alignment: .bottom)
    }
}

#Preview {
    HomeHeaderView()
}
