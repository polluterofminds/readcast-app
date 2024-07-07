//
//  Item.swift
//  readcast
//
//  Created by Justin Hunter on 12/26/23.
//

import Foundation
import SwiftData

struct Book: Codable {
    let id: String?
    let author: String?
    let categories: String?
    let createdAt: String?
    let description: String?
    let thumbnail: String?
    let title: String?
    let reviews: Int?
    let titleAuthorKey: String?

    enum CodingKeys: String, CodingKey {
        case id
        case author
        case categories
        case createdAt = "created_at"
        case description
        case thumbnail
        case title
        case reviews
        case titleAuthorKey = "title_author_key"
    }
}

struct BookUpdateRequest: Codable {
    let book: Book
    let details: Details
}

struct Details: Codable {
    let status: String
    let bookFormat: String
    let dateCompleted: String?
}

struct CommentRequest: Codable {
    let book: Book
    let review: String
}

struct ReviewUser: Codable {
    let fid: Double
    let username: String?
    let pfp: String?
    let bio: String?
    let display_name: String?
}

struct ReviewItem: Codable {
    var id: String
    var timestamp: String
    var title: String
    var review: String
    var created_at: String
    var fid: Double
    var stars: Int8?
    var books: Book
    var hash: String?
    var thread_hash: String?
    var parent_hash: String?
    var book_uuid: String
    var weight: Int?
    var users: ReviewUser?
}

struct LibraryItem: Codable {
    var id: String?
    var book_id_fid_key: String
    var fid: Int?
    var book_id: String
    var status: String?
    var book_type: String?
    var date_completed: String?
    var books: Book
    let user_id: UUID?
}

struct SearchItem: Codable, Hashable {
    let id: String
    let isbn10: String?
    let isbn13: String?
    let title: String
    let author: String
    let description: String?
    let thumbnail: String?
    let category: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case isbn10 = "isbn_10"
        case isbn13 = "isbn_13"
        case title
        case author
        case description
        case thumbnail
        case category
    }
}

struct ReportRequest: Codable {
    let reviewId: String
    let reporteeFid: Int
}

class BookManager {
    static let shared = BookManager()
    
    var books: [Book] = []
    var reviews: [ReviewItem] = []
    var searchResults: [SearchItem] = []
    var libraryItem: LibraryItem = LibraryItem(book_id_fid_key: "", fid: 0, book_id: "", books: Book(id: "", author: "", categories: "", createdAt: "", description: "", thumbnail: "", title: "", reviews: 0, titleAuthorKey: ""), user_id: nil)
    
    func fetchBooks(category: String, fid: Int, completion: @escaping (Result<[Book], Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/books/\(category)?fid=\(fid)") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode([Book].self, from: data)
                self.books = decodedData
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func fetchBookByTitleAuthorKey(titleAuthorKey: String, completion: @escaping (Result<Book, Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/books/key/\(titleAuthorKey)") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode(Book.self, from: data)
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func fetchBookFromLibrary(bookId: String, completion: @escaping (Result<LibraryItem, Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/books/library/\(bookId)") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        let token = UserManager.shared.getAuthToken()
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        // Add Authorization header
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode(LibraryItem.self, from: data)
                print(decodedData)
                self.libraryItem = decodedData
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func fetchBooksFromLibrary(completion: @escaping (Result<[LibraryItem], Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/books/library") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        let token = UserManager.shared.getAuthToken()
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        // Add Authorization header
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode([LibraryItem].self, from: data)
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func upsertLibraryStatus(book: Book, libraryId: String, bookStatus: String, bookType: String, dateCompleted: Date?, completion: @escaping (Result<String, Error>) -> Void) {
        let dateFormatter = ISO8601DateFormatter()
        let formattedDate = dateCompleted != nil ? dateFormatter.string(from: dateCompleted!) : nil
        
        let details = Details(status: bookStatus, bookFormat: bookType, dateCompleted: formattedDate)
        let updateRequest = BookUpdateRequest(book: book, details: details)
        let token = UserManager.shared.getAuthToken()
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/books/library/\(libraryId)") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let jsonData = try JSONEncoder().encode(updateRequest)
            request.httpBody = jsonData
            
            let task = URLSession.shared.dataTask(with: request) { data, response, error in
                if let error = error {
                    print("Error occurred: \(error)")
                    completion(.failure(error))
                    return
                }
                
                guard let data = data else {
                    completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                    return
                }
    
                completion(.success("Success"))
            }
            
            task.resume()
        } catch {
            print("Error serializing JSON: \(error)")
            completion(.failure(error))
            return
        }
    }
    
    func addBookToLibrary(book: Book, bookStatus: String, bookType: String, completion: @escaping (Result<String, Error>) -> Void) {
        let details = Details(status: bookStatus, bookFormat: bookType, dateCompleted: nil)
        let updateRequest = BookUpdateRequest(book: book, details: details)
        let token = UserManager.shared.getAuthToken()
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/books/library") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let jsonData = try JSONEncoder().encode(updateRequest)
            request.httpBody = jsonData
            let task = URLSession.shared.dataTask(with: request) { data, response, error in
                if let error = error {
                    print("Error occurred: \(error)")
                    completion(.failure(error))
                    return
                }
                
                guard let data = data else {
                    completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                    return
                }
    
                completion(.success("Success"))
            }
            
            task.resume()
        } catch {
            print("Error serializing JSON: \(error)")
            completion(.failure(error))
            return
        }
    }

    func parse<T: Codable>(_ jsonString: String, type: [T].Type) -> [T]? {
        let decoder = JSONDecoder()
        if let jsonData = jsonString.data(using: .utf8) {
            do {
                let array = try decoder.decode(type, from: jsonData)
                return array
            } catch {
                print("Failed to decode JSON: \(error.localizedDescription)")
            }
        }
        return nil
    }
    
    func fetchReviews(bookId: String, completion: @escaping (Result<[ReviewItem], Error>) -> Void) {
        var reportedArray: [Reported] = []
        
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/reviews/\(bookId)") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode([ReviewItem].self, from: data)
                if let reported = UserDefaults.standard.value(forKey: "reported") as? String {
                    reportedArray = self.parse(reported, type: [Reported].self) ?? []
                }
                let reportedFids = reportedArray.map { $0.fid }
                            
                // Filter out reviews with fids in reportedFids
                let filteredReviews = decodedData.filter { !reportedFids.contains(Int($0.fid)) }
                
                self.reviews = filteredReviews
                completion(.success(filteredReviews))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func fetchReviewsByTitle(title: String, completion: @escaping (Result<[ReviewItem], Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/reviews/\(title.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode([ReviewItem].self, from: data)
                self.reviews = decodedData
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func fetchSearchResults(searchText: String, completion: @escaping (Result<[SearchItem], Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/books/search?terms=\(searchText)") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                return
            }
            
            do {
                let decodedData = try JSONDecoder().decode([SearchItem].self, from: data)
                self.searchResults = decodedData
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func submitComment(book: Book, commentText: String, completion: @escaping (Result<String, Error>) -> Void) {
        let commentRequest = CommentRequest(book: book, review: commentText)

        let token = UserManager.shared.getAuthToken()
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/reviews") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let jsonData = try JSONEncoder().encode(commentRequest)
            request.httpBody = jsonData
            let task = URLSession.shared.dataTask(with: request) { data, response, error in
                if let error = error {
                    print("Error occurred: \(error)")
                    completion(.failure(error))
                    return
                }
                
                guard let data = data else {
                    completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                    return
                }
    
                completion(.success("Success"))
            }
            
            task.resume()
        } catch {
            print("Error serializing JSON: \(error)")
            completion(.failure(error))
            return
        }
    }
    
    func reportReview(review: ReviewItem, completion: @escaping (Result<String, Error>) -> Void) {
        let token = UserManager.shared.getAuthToken()
        let reportRequest = ReportRequest(reviewId: review.id, reporteeFid: Int(review.fid))
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/reviews/report") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let jsonData = try JSONEncoder().encode(reportRequest)
            request.httpBody = jsonData
            
            let task = URLSession.shared.dataTask(with: request) { data, response, error in
                if let error = error {
                    print("Error occurred: \(error)")
                    completion(.failure(error))
                    return
                }
                
                guard let data = data else {
                    completion(.failure(NSError(domain: "No data received", code: 1, userInfo: nil)))
                    return
                }
    
                completion(.success("Success"))
            }
            
            task.resume()
        } catch {
            print("Error serializing JSON: \(error)")
            completion(.failure(error))
            return
        }
    }
}
