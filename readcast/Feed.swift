//
//  Feed.swift
//  readcast
//
//  Created by Justin Hunter on 12/28/23.
//

import SwiftUI

struct Feed: View {
    @State private var data: [ReviewItem] = []
    
    func fetchData() {
        guard let url = URL(string: "http://localhost:3000/reviews") else { return }

        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data else { return }
            do {
                let reviews = try JSONDecoder().decode([ReviewItem].self, from: data)
                DispatchQueue.main.async {
                    self.data = reviews
                }
            } catch {
//                print(error.localizedDescription)
                print(String(describing: error))
            }
        }.resume()
    }
    var body: some View {
        List(data, id: \.id) { review in
                    VStack(alignment: .leading) {
//                        Text(review.title)
                        Text(review.review)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
                .onAppear {
                    fetchData()
                }
        }
    }


#Preview {
    Feed()
}
