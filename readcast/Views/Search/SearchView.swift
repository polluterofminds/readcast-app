//
//  SearchView.swift
//  readcast
//
//  Created by Justin Hunter on 3/17/24.
//

import SwiftUI
import Combine

class SearchViewModel: ObservableObject {
    @Published var searchText = ""
    @Published var results: [SearchItem] = []
    @Published var progressView = false
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        $searchText
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .flatMap { text -> AnyPublisher<Bool, Never> in
                if text.isEmpty {
                    return Just(false).eraseToAnyPublisher()
                } else {
                    return Just(true).eraseToAnyPublisher()
                }
            }
            .assign(to: &$progressView)
        //  Debounce search
        $searchText
            .debounce(for: .milliseconds(1500), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { [weak self] in self?.performSearch(text: $0) }
            .store(in: &cancellables)
    }
    
    func performSearch(text: String) {
        if text != "" {
            BookManager.shared.fetchSearchResults(searchText: text) { result in
                DispatchQueue.main.async {
                    switch result {
                    case .success(let searchResults):
                        self.results = searchResults
                        self.progressView = false
                    case .failure(let error):
                        print("Failed to fetch search results: \(error)")
                        self.progressView = false
                    }
                }
            }
        }
    }
}

struct SearchView: View {
    @StateObject private var viewModel = SearchViewModel()
    @State public var recentSearches: [SearchItem] = []
    
    func loadRecentSearches() {
        print("Loading recent...")
        guard let data = UserDefaults.standard.data(forKey: "recent_searches") else { return }
        do {
            let decoder = JSONDecoder()
            let items = try decoder.decode([SearchItem].self, from: data)
            recentSearches = items
        } catch {
            print("Error decoding items: \(error.localizedDescription)")
        }
    }
    
    func clearSearch() {
        do {
            let recentSearches: [SearchItem] = []
            
            let encoder = JSONEncoder()
            let encodedData = try encoder.encode(recentSearches)
            UserDefaults.standard.set(encodedData, forKey: "recent_searches")
            loadRecentSearches()
        } catch {
            print("Error encoding items: \(error.localizedDescription)")
        }
    }
    
    var body: some View {
        VStack(alignment: .leading) {
            SearchBarView(searchText: $viewModel.searchText)
            if viewModel.progressView {
                Spacer()
                HStack {
                    Spacer()
                    ProgressView()
                    Spacer()
                }
                Spacer()
            } else if viewModel.results.isEmpty {
                HStack {
                    Text("Recent searches")
                        .padding()
                        .font(.system(size: 20))
                        .fontWeight(.bold)
                    Spacer()
                    Button(action: clearSearch) {
                        Text("Clear history")
                            .padding()
                            .font(.system(size: 14))
                            .foregroundColor(.black)
                    }
                }
                .onAppear {
                    loadRecentSearches()
                }
                VStack {
                    ScrollView {
                        SearchResultsView(results: $recentSearches)
                    }
                }
                
            } else {
                ScrollView {
                    SearchResultsView(results: $viewModel.results)
                }
            }
            Spacer()
        }
        .navigationBarBackButtonHidden(true)
        .navigationBarItems(leading:
            SearchHeaderView()
        )
    }
}

#Preview {
    SearchView()
}
