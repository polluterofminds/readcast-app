//
//  DBManager.swift
//  readcast
//
//  Created by Justin Hunter on 7/7/24.
//

import Foundation

//struct Library: Decodable {
//    let id: UUID
//    let created_at: String
//    let fid: Int?
//    let book_id: UUID
//    let status: String?
//    let book_type: String
//    let date_completed: String?
//    let book_id_fid_key: String
//    let user_id: String
//}

class DBManager {
    static let shared = DBManager()
    func loadLibrary() async -> [LibraryItem] {
        let client = UserManager.shared.client
        do {
            let library: [LibraryItem] = try await client
              .from("library")
              .select()
              .execute()
              .value
            return library
        } catch {
            print("Error loading library \(error)")
            return []
        }
    }
    
    func upsertBookLibrary(item: LibraryItem) async {
        let client = UserManager.shared.client
        do {
            try await client
              .from("library")
              .insert(item)
              .execute()
        } catch {
            print("Error loading library \(error)")
        }
    }
}
