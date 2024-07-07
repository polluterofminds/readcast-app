//
//  DBManager.swift
//  readcast
//
//  Created by Justin Hunter on 7/7/24.
//

import Foundation

struct LibraryInsert: Decodable, Encodable {
    let book_id: String
    let status: String?
    let book_type: String
    let date_completed: String?
    let book_id_fid_key: String
    let user_id: UUID
}

class DBManager {
    static let shared = DBManager()
    //  We use LibraryItem struct here because we join the Books table
    func loadLibrary() async -> [LibraryItem] {
        let client = UserManager.shared.client
        do {
            let library: [LibraryItem] = try await client
              .from("library")
              .select("*, books(*)")
              .execute()
              .value
            return library
        } catch {
            print("Error loading library \(error)")
            return []
        }
    }
    
    func loadSingLibraryItem(bookId: String) async -> [LibraryItem] {
        let client = UserManager.shared.client
        do {
            let library: [LibraryItem] = try await client
              .from("library")
              .select("*, books(*)")
              .eq("book_id", value: bookId)
              .eq("user_id", value: UserManager.shared.session?.user.id)
              .execute()
              .value
            return library
        } catch {
            print("Error loading library \(error)")
            return []
        }
    }
    
    func upsertBookLibrary(item: LibraryInsert) async {
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
    
    func removeFromLibrary(bookId: String) async -> Void {
        let client = UserManager.shared.client
        do {
            print("Removing...")
            try await client
              .from("library")
              .delete()
              .eq("book_id", value: bookId)
              .eq("user_id", value: UserManager.shared.session?.user.id)
              .execute()
        } catch {
            print("Error removing from library \(error)")
        }
    }
}
