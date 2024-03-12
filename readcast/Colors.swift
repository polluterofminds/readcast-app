//
//  Colors.swift
//  readcast
//
//  Created by Justin Hunter on 3/12/24.
//

import Foundation
import SwiftUI

func hexToColor(hex: String) -> Color {
    var hex = hex.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
    hex = hex.replacingOccurrences(of: "#", with: "")
    
    var rgb: UInt64 = 0
    Scanner(string: hex).scanHexInt64(&rgb)
    
    let red = Double((rgb & 0xFF0000) >> 16) / 255.0
    let green = Double((rgb & 0x00FF00) >> 8) / 255.0
    let blue = Double(rgb & 0x0000FF) / 255.0
    
    return Color(red: red, green: green, blue: blue)
}
