//
//  UserManager.swift
//  readcast
//
//  Created by Justin Hunter on 3/23/24.
//

import Foundation

struct User: Codable {
    let fid: Int
    let custodyAddress: String
    let recoveryAddress: String
    let followingCount: Int
    let followerCount: Int
    let verifications: [String]
    let bio: String
    let displayName: String
    let pfpURL: String
    let username: String
    let powerBadgeUser: Bool
    
    enum CodingKeys: String, CodingKey {
        case fid
        case custodyAddress = "custody_address"
        case recoveryAddress = "recovery_address"
        case followingCount = "following_count"
        case followerCount = "follower_count"
        case verifications
        case bio
        case displayName = "display_name"
        case pfpURL = "pfp_url"
        case username
        case powerBadgeUser = "power_badge_user"
    }
}

struct SignerData: Codable {
    let data: SignerInfo
}

struct SignerInfo: Codable {
    let signerId: String
    let token: String
    let deepLinkURL: String
    let status: String

    enum CodingKeys: String, CodingKey {
        case signerId = "signer_id"
        case token
        case deepLinkURL = "deep_link_url"
        case status
    }
}

struct SignedKeyResponse: Codable {
    let data: ResultData
}

struct ResultData: Codable {
    let result: ResultInfo
}

struct ResultInfo: Codable {
    let signedKeyRequest: SignedKeyRequest
}

struct SignedKeyRequest: Codable {
    let token: String
    let deeplinkUrl: String
    let key: String
    let requestFid: Int
    let userFid: Int?
    let state: String
    let isSponsored: Bool
}

struct Reported: Codable {
    let fid: Int
}

struct Credentials: Codable {
    let email: String
    let password: String
}

struct EmailSignInResponse: Codable {
    let signerId: String
    let status: String
    let fid: String
    enum CodingKeys: String, CodingKey {
        case signerId = "signer_id"
        case status
        case fid
    }
}

class UserManager {
    static let shared = UserManager()
    
    var token: String = ""
    var user: User = User(fid: 0, custodyAddress: "", recoveryAddress: "", followingCount: 0, followerCount: 0, verifications: [], bio: "", displayName: "", pfpURL: "", username: "", powerBadgeUser: false)
    var signerDetails: SignerData = SignerData(data: SignerInfo(signerId: "", token: "", deepLinkURL: "", status: ""))
    
    func getUserInfo(completion: @escaping (Result<User, Error>) -> Void) {
        var userFid = 0
        if let fid = UserDefaults.standard.value(forKey: "fid") as? String {
            print("Fid: \(fid)")
            userFid = Int(fid) ?? 0
        } else {
            print("Token not found")
            logOut()
        }
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/users/\(userFid)") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
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
                let decodedData = try JSONDecoder().decode(User.self, from: data)
                self.user = decodedData
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func getAuthStatus() -> Bool {
        var approved = false
        if let authApproved = UserDefaults.standard.value(forKey: "signer_approved") as? String {
            if authApproved == "true" {
                approved = true
            }
        }
        
        return approved
    }
    
    func getAuthToken() -> String {
        var token = ""
        if let authToken = UserDefaults.standard.value(forKey: "auth_token") as? String {
            print("Token: \(authToken)")
            token = authToken
        } else {
            print("Token not found")
        }
        
        return token
    }
    
    func logOut() {
        UserDefaults.standard.removeObject(forKey: "auth_token")
        UserDefaults.standard.removeObject(forKey: "signer_approved")
        UserDefaults.standard.removeObject(forKey: "fid")
    }
    
    func signInEmail(email: String, password: String, completion: @escaping (Result<EmailSignInResponse, Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/users/sign-in/email") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        let credentials = Credentials(email: email, password: password)
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        do {
            let jsonData = try JSONEncoder().encode(credentials)
            request.httpBody = jsonData
        } catch {
            completion(.failure(error))
        }
        
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
                let decodedData = try JSONDecoder().decode(EmailSignInResponse.self, from: data)
                //  Store the signer_id
                print("signer id")
                print(decodedData.signerId)
                UserDefaults.standard.setValue(decodedData.signerId, forKey: "auth_token")
                UserDefaults.standard.setValue("true", forKey: "signer_approved")
                UserDefaults.standard.setValue(decodedData.fid, forKey: "fid")
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func signIn(completion: @escaping (Result<SignerData, Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/users/sign-in") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
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
                let decodedData = try JSONDecoder().decode(SignerData.self, from: data)
                self.signerDetails = decodedData
                //  Store the signer_id
                UserDefaults.standard.setValue(decodedData.data.signerId, forKey: "auth_token")
                UserDefaults.standard.setValue("false", forKey: "signer_approved")
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func pollWarpcast(token: String, completion: @escaping (Result<SignedKeyResponse, Error>) -> Void) {
        guard let url = URL(string: "\(ConfigManager.shared.apiUrl)/users/poll?token=\(token)") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
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
                let decodedData = try JSONDecoder().decode(SignedKeyResponse.self, from: data)
                if(decodedData.data.result.signedKeyRequest.state == "completed") {
                    //  Store the user FID
                    print("completed")
                    print(decodedData.data.result.signedKeyRequest)
                    UserDefaults.standard.setValue(String(decodedData.data.result.signedKeyRequest.userFid!), forKey: "fid")
                    UserDefaults.standard.setValue("true", forKey: "signer_approved")
                }
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func storeReportedFid(fid: Int) {
        var reportedArray: [Reported] = []
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
        
        if let reported = UserDefaults.standard.value(forKey: "reported") as? String {
            reportedArray = parse(reported, type: [Reported].self) ?? []
        }
        
        reportedArray.append(Reported(fid: fid))
        
        //  Stringify and store in userdefaults
        
        func stringify<T: Codable>(_ array: [T]) -> String? {
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted // Optional: for pretty-printed JSON
            do {
                let jsonData = try encoder.encode(array)
                if let jsonString = String(data: jsonData, encoding: .utf8) {
                    return jsonString
                }
            } catch {
                print("Failed to encode array: \(error.localizedDescription)")
            }
            return nil
        }

        // Convert the array to a JSON string
        if let jsonString = stringify(reportedArray) {
            UserDefaults.standard.setValue(jsonString, forKey: "reported")
        }
    }
}
