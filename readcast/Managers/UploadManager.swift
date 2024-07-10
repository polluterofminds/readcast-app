//
//  UploadManager.swift
//  readcast
//
//  Created by Justin Hunter on 7/9/24.
//

import Foundation

import SwiftUI

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhYzg5Nzc4My0wOTI3LTQwZjUtYmE1ZS0yYWNhNmVlNDk4NzMiLCJlbWFpbCI6ImNvbnRhY3RAZ3JhcGhpdGVkb2NzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjowfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2NDI4ZGIzODVkZTBhOWE0N2MxNCIsInNjb3BlZEtleVNlY3JldCI6ImMxMTQxNGJkNjI1ODVjZTU0NDUwMjVkODE5N2YyMDIyMWI4ZDhhOTQzODk5Mjg1YTU4ZDRlZDc2NTI3NTA4YmEiLCJpYXQiOjE3MDQ2NDI0OTN9.2jF-42DFgr9SOoGo3YipiUChClOEe3UcqJyCorU3Hns"

func uploadImageToPinata(image: UIImage, completion: @escaping (String?) -> Void) {
    guard let url = URL(string: "https://api.pinata.cloud/pinning/pinFileToIPFS") else {
        completion(nil)
        return
    }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

    let boundary = UUID().uuidString
    request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

    let imageData = image.jpegData(compressionQuality: 0.8)!
    var body = Data()

    // Image file data
    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"file\"; filename=\"image.jpg\"\r\n".data(using: .utf8)!)
    body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
    body.append(imageData)
    body.append("\r\n".data(using: .utf8)!)

    // Pinata metadata
    let pinataMetadata = """
    {
      "name": "Pinnie.json"
    }
    """.data(using: .utf8)!

    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"pinataMetadata\"\r\n".data(using: .utf8)!)
    body.append("Content-Type: application/json\r\n\r\n".data(using: .utf8)!)
    body.append(pinataMetadata)
    body.append("\r\n".data(using: .utf8)!)

    // Pinata options
    let pinataOptions = """
    {
      "cidVersion": 1
    }
    """.data(using: .utf8)!

    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"pinataOptions\"\r\n".data(using: .utf8)!)
    body.append("Content-Type: application/json\r\n\r\n".data(using: .utf8)!)
    body.append(pinataOptions)
    body.append("\r\n".data(using: .utf8)!)

    body.append("--\(boundary)--\r\n".data(using: .utf8)!)

    request.httpBody = body

    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            print("Failed to upload image: \(error)")
            completion(nil)
            return
        }

        guard let data = data, let response = response as? HTTPURLResponse, response.statusCode == 200 else {
            print("Failed to upload image: Invalid response")
            completion(nil)
            return
        }

        // Handle the response
        if let jsonResponse = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
           let ipfsHash = jsonResponse["IpfsHash"] as? String {
            print("Image uploaded successfully: \(ipfsHash)")
            completion(ipfsHash)
        } else {
            print("Image uploaded successfully, but failed to parse response")
            completion(nil)
        }
    }.resume()
}


