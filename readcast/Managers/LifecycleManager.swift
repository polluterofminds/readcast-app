//
//  LifecycleManager.swift
//  readcast
//
//  Created by Justin Hunter on 4/15/24.
//

import Foundation
import SwiftUI

class AppLifecycleWatcher: ObservableObject {
    @Published var isActive = false
    
    init() {
        NotificationCenter.default.addObserver(self, selector: #selector(appMovedToForeground), name: UIApplication.willEnterForegroundNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(appMovedToBackground), name: UIApplication.didEnterBackgroundNotification, object: nil)
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc func appMovedToForeground() {
        isActive = true
    }
    
    @objc func appMovedToBackground() {
        isActive = false
    }
}
