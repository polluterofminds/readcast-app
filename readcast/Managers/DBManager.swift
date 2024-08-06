//
//  DBManager.swift
//  readcast
//
//  Created by Justin Hunter on 7/7/24.
//

import Foundation

struct LibraryInsert: Decodable, Encodable {
    let id: String?
    let book_id: String
    let status: String?
    let book_type: String
    let date_completed: String?
    let book_id_fid_key: String
    let user_id: UUID
}

struct BookInsert: Decodable, Encodable {
    let title: String
    let author: String
    let description: String
    let thumbnail: String
    let categories: String
    let title_author_key: String
}

struct DBUser: Decodable, Encodable {
    let email_address: String?
    let id: UUID?
    let app_user: Bool?
    let display_name: String?
    let username: String?
    let pfp: String?
    let bio: String?
    let fid: Int?
}

struct DBUserUpdate: Decodable, Encodable {
    let email_address: String
    let app_user: Bool?
    let display_name: String?
    let username: String?
    let pfp: String?
    let bio: String?
    let fid: Int?
}

struct ReviewItemInsert: Codable {
    var timestamp: String
    var title: String
    var review: String
    var fid: Int?
    var stars: Int8?
    var book_uuid: String
    var user_id: UUID
    var sent_from_app: Bool
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
    
    func insertBookInLibrary(item: LibraryInsert) async {
        print(item)
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
    
    func upsertBookInLibrary(book: Book, item: LibraryInsert) async {
        let client = UserManager.shared.client
        do {
            try await client
                .from("library")
                .upsert(item, onConflict: "book_id_fid_key")
                .execute()
        } catch {
            print("Error updating library \(error)")
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
    
    func upsertBook(book: Book) async -> Void {
        let client = UserManager.shared.client
        
        var httpsThumbnail = ""
        if let uri = book.thumbnail, let range = uri.range(of: "://") {
            let splitUri = uri[range.upperBound...]
            let finalUri = "https://\(splitUri)"
            print(finalUri)
            httpsThumbnail = finalUri
        } else {
            print("Invalid URI")
        }

        
        let bookToInsert = BookInsert(title: book.title ?? "", author: book.author ?? "", description: book.description ?? "", thumbnail: httpsThumbnail, categories: book.categories ?? "", title_author_key: book.titleAuthorKey ?? "")
        
        do {
            try await client
                .from("books")
                .upsert(bookToInsert)
                .execute()
        } catch {
            print("Error upserting book \(error)")
        }
    }
    
    func upsertUser() async -> Void {
        let client = UserManager.shared.client
        let session = UserManager.shared.client.auth.currentSession
        do {
            if session?.user.email != nil && session?.user.id != nil {
                let user = DBUser(email_address: session!.user.email!, id: session!.user.id, app_user: true, display_name: nil, username: nil, pfp: nil, bio: nil, fid: nil)
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
    
    func upsertUserWithValues(username: String?, display_name: String?, bio: String?, pfp_url: String?) async -> Void {
        let client = UserManager.shared.client
        let session = UserManager.shared.client.auth.currentSession
        do {
            if session?.user.email != nil && session?.user.id != nil {
                let user = DBUserUpdate(email_address: session!.user.email!, app_user: true, display_name: display_name ?? nil, username: username ?? nil, pfp: pfp_url ?? nil, bio: bio != nil ? bio : nil, fid: nil)
                print(user)
                try await client
                    .from("users")
                    .update(user)
                    .eq("id", value: session!.user.id)
                    .execute()
            } else {
                print("Session is nil")
            }
        } catch {
            print("Error updating user \(error)")
        }
    }
    
    func getUser() async -> DBUser {
        print("Getting user...")
        let client = UserManager.shared.client
        do {
            let users: [DBUser] = try await client
                .from("users")
                .select()
                .eq("id", value: UserManager.shared.client.auth.currentUser?.id)
                .execute()
                .value
            return users.first ?? DBUser(email_address: "", id: nil, app_user: nil, display_name: nil, username: nil, pfp: nil, bio: nil, fid: nil)
        } catch {
            print("Error getting user \(error)")
            return DBUser(email_address: "", id: nil, app_user: nil, display_name: nil, username: nil, pfp: nil, bio: nil, fid: nil)
        }
    }
    
    func isUsernameAvailable(username: String) async -> Bool {
        let client = UserManager.shared.client
        do {
            print(username)
            let users: [DBUser] = try await client
                .from("users")
                .select()
                .eq("username", value: username)
                .execute()
                .value
            
            print(users)
            if users.isEmpty {
                print("returning true")
                return true
            }
            print("returning false")
            return false
        } catch {
            print("Error getting user \(error)")
            return false
        }
    }
    
    func submitReview(book: Book, review: String) async -> Void {
        await upsertBook(book: book)
        let currentTimestamp = Date().timeIntervalSince1970
        let client = UserManager.shared.client
        do {
            if client.auth.currentSession?.user.id != nil {
                let reviewContent = ReviewItemInsert(timestamp: String(currentTimestamp), title: book.title ?? "", review: review, book_uuid: book.id ?? "", user_id: client.auth.currentSession!.user.id, sent_from_app: true)
                print(reviewContent)
                try await client
                    .from("reviews")
                    .insert(reviewContent)
                    .execute()
            }
        } catch {
            print("Error loading library \(error)")
        }
    }
    
    func deleteReview(review: ReviewItem) async -> Void {
        let client = UserManager.shared.client
        do {
            let data = try await client
                .from("reviews")
                .delete()
                .eq("id", value: review.review_id)
                .eq("user_id", value: client.auth.currentUser?.id)
                .execute()
                .value
            print(data)
        } catch {
            print("Error deleting review \(error)")
        }
    }
    
    func deleteUser(userId: UUID) async -> String {
        let client = UserManager.shared.client
        
        //  Delete reviews
        do {
            let data = try await client
                .from("reviews")
                .delete()
                .eq("user_id", value: client.auth.currentUser?.id)
                .execute()
                .value
        } catch {
            print("Error deleting reviews for user \(error)")
            return "Error"
        }
        //  Delete library
        do {
            let data = try await client
                .from("library")
                .delete()
                .eq("user_id", value: client.auth.currentUser?.id)
                .execute()
                .value
        } catch {
            print("Error deleting library for user \(error)")
            return "Error"
        }
        //  Delete user
        do {
            let data = try await client
                .from("users")
                .delete()
                .eq("id", value: userId)
                .execute()
                .value
            print(data)
        } catch {
            print("Error deleting user \(error)")
            return "Error"
        }
        
        return "Done"
    }
}
