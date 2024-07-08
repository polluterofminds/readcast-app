//
//  UserManager.swift
//  readcast
//
//  Created by Justin Hunter on 3/23/24.
//

import Foundation
import Supabase
import Gravatar

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

struct AuthStatus {
    let isLoggedIn: Bool
    let isWarpcast: Bool
}

class UserManager {
    static let shared = UserManager()
    let client: SupabaseClient
    
    var session: Session?
    
    var authStatus: AuthStatus = AuthStatus(isLoggedIn: false, isWarpcast: false)
    
    private init() {
        client = SupabaseClient(supabaseURL: URL(string: "https://zytztcmrhfyjwfsrjtmq.supabase.co")!, supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHp0Y21yaGZ5andmc3JqdG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2MzEzMzUsImV4cCI6MjAxOTIwNzMzNX0.kTYNOq2ATSzAMBfn94_vs6JqlWOa-r4HAmOXeVIKIDU")
        
        Task {
            await initializeSession()
        }
    }
    
    private func initializeSession() async {
        do {
            session = try await client.auth.session
        } catch {
            print("Failed to get session: \(error.localizedDescription)")
        }
    }
    
    var token: String = ""
    var user: User = User(fid: 0, custodyAddress: "", recoveryAddress: "", followingCount: 0, followerCount: 0, verifications: [], bio: "", displayName: "", pfpURL: "", username: "", powerBadgeUser: false)
    var signerDetails: SignerData = SignerData(data: SignerInfo(signerId: "", token: "", deepLinkURL: "", status: ""))
    
    func getUserInfo(completion: @escaping (Result<DBUser, Error>) -> Void) {
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
                let decodedData = try JSONDecoder().decode(DBUser.self, from: data)
                completion(.success(decodedData))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
    
    func getAuthStatus() async -> AuthStatus {
        var status = AuthStatus(isLoggedIn: false, isWarpcast: false)
        if let authApproved = UserDefaults.standard.value(forKey: "signer_approved") as? String {
            print("Is auth approved?")
            print(authApproved)
            if authApproved == "true" {
                print("Auth is approved")
                status = AuthStatus(isLoggedIn: true, isWarpcast: true)
            } else {
                do {
                    let sessionData: Session = try await client.auth.session
                    if sessionData.user.email != "" && sessionData.user.email != nil {
                        status = AuthStatus(isLoggedIn: true, isWarpcast: false)
                    }
                } catch {
                    print("Error getting session data")
                }
            }
        } else {
            print("No auth approved data, checking Supabase")
            do {
                let sessionData: Session = try await client.auth.session
                if sessionData.user.email != "" && sessionData.user.email != nil {
                    status = AuthStatus(isLoggedIn: true, isWarpcast: false)
                }
            } catch {
                print("Error getting session data")
            }
        }
        authStatus = status
        return status
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
