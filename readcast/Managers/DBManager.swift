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

struct DBUser: Decodable, Encodable {
    let email_address: String
    let id: UUID?
    let app_user: Bool?
    let display_name: String?
    let username: String?
    let pfp_url: String?
    let bio: String?
    let fid: Int?
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
    
    func upsertUser() async -> Void {
        let client = UserManager.shared.client
        let session = UserManager.shared.client.auth.currentSession
        do {
            if session?.user.email != nil && session?.user.id != nil {
                let user = DBUser(email_address: session!.user.email!, id: session!.user.id, app_user: true, display_name: nil, username: nil, pfp_url: nil, bio: nil, fid: nil)
                try await client
                  .from("users")
                  .upsert(user)
                  .execute()
            } else {
                print("Session is nil")
            }
        } catch {
            print("Error upserting user \(error)")
        }
    }
    
    func getUser() async -> DBUser {
        let client = UserManager.shared.client
        do {
            let users: [DBUser] = try await client
              .from("users")
              .select()
              .eq("id", value: UserManager.shared.session?.user.id)
              .execute()
              .value
            
            return users.first ?? DBUser(email_address: "", id: nil, app_user: nil, display_name: nil, username: nil, pfp_url: nil, bio: nil, fid: nil)
        } catch {
            print("Error upserting user \(error)")
            return DBUser(email_address: "", id: nil, app_user: nil, display_name: nil, username: nil, pfp_url: nil, bio: nil, fid: nil)
        }
    }
}
