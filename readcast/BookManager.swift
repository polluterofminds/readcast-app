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

    enum CodingKeys: String, CodingKey {
        case id
        case author
        case categories
        case createdAt = "created_at"
        case description
        case thumbnail
        case title
        case reviews
    }
}

struct ReviewItem: Codable {
    var id: String
    var timestamp: Date
    var title: String
    var review: String
    var created_at: Date
    var fid: Int8
    var stars: Int8
    var books: Book
}

class BookManager {
    static let shared = BookManager()
    
    var books: [Book] = []
    
    func fetchBooks(category: String, completion: @escaping (Result<[Book], Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/books/\(category)") else {
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
}
