//
//  ConfigManager.swift
//  readcast
//
//  Created by Justin Hunter on 3/12/24.
//

import Foundation

class ConfigManager {
    static let shared = ConfigManager()
    var apiUrl: String = "https://api.readcast.xyz"
//    var apiUrl: String = "https://beef-66-68-201-142.ngrok-free.app"
    var primaryFont: String = "Shapiro 95 Super Extd"
    let gatewayUrl = "https://readcast.mypinata.cloud"
}
