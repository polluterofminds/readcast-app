//
//  BookStatusView.swift
//  readcast
//
//  Created by Justin Hunter on 4/20/24.
//

import SwiftUI

struct Option {
    let name: String
    let value: String
}

struct BottomBorderModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(.bottom, 8) // Add some padding below each item
            .overlay(Rectangle().frame(height: 1).foregroundColor(Color.gray), alignment: .bottom)
    }
}

struct BookStatusView: View {
    @Binding var isPresented: Bool
    @Binding public var date: Date
    @State public var options: [Option] = [Option(name: "Paperback", value: "paperback"), Option(name: "Hardcover", value: "hardcover"), Option(name: "E-Book", value: "ebook"), Option(name: "Audiobook", value: "audio")]
    @Binding public var selectedStatus: StatusValue
    @State public var selectedBookType: Option = Option(name: "Paperback", value: "paperback")
    
    var updateStatus: (String) -> Void
        
    var body: some View {
        VStack {
            HStack {
                Spacer()
                Button("Cancel") {
                    isPresented = false
                }
                .foregroundColor(.black)
            }
            .overlay(
                Text("Update status")
                    .font(Font.custom(ConfigManager.shared.primaryFont, size: 16))
                    .foregroundColor(.black),
                alignment: .center
            )
            .padding()
            .frame(maxWidth: .infinity)
            Spacer()
            ScrollView {
                VStack {
                    ForEach(options.indices, id: \.self) { index in
                        let option = options[index]
                        Button(action: {
                            selectedBookType = option
                        }) {
                            HStack {
                                if selectedBookType.value == option.value {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(hexToColor(hex: "#CEFF41"))
                                        .padding(6)
                                        .background(.black) .clipShape(RoundedRectangle(cornerRadius: 100))                                                           } else {
                                    Spacer().frame(width: 26)
                                }
                                Text(option.name)
                                    .foregroundColor(.black)
                                    .frame(minWidth: 0, maxWidth: .infinity, alignment: .center)
                            }
                            .padding()
                            .overlay(
                                index < options.count - 1 ?
                                Rectangle().frame(height: 1).foregroundColor(Color.gray).padding(.top, 8) :
                                    nil, alignment: .bottom
                            )
                        }
                    }
                }
                if selectedStatus.value == "completed" {
                    //  Optional date completed
                    HStack {
                        Spacer()
                        DatePicker(
                                "Completed Date",
                                selection: $date,
                                displayedComponents: [.date]
                            )
                        .foregroundColor(.black)
                        .datePickerStyle(.compact)
                        .accentColor(.black)
                        .background(.white)
                        .padding(.bottom, 100)
                        .padding(.horizontal)
                        .environment(\.colorScheme, .light)
                    }
                }
                Spacer()
                Button(action: {
                    updateStatus(selectedBookType.value)
                }) {
                    Text("Update")
                        .foregroundColor(.white)
                        .padding()
                        .background(.black)
                        .cornerRadius(10)
                }.padding(.bottom, 50)
            }
        }
        .frame(width: UIScreen.main.bounds.width * 0.95, height: UIScreen.main.bounds.height * 0.75)
        .background(Color.white)
        .padding()
        .animation(.spring())
    }
}

struct ContentView_Previews: PreviewProvider {
    static var selectedStatus = StatusValue(display: "Completed", value: "completed", icon: "checkmark")
    static var date = Date()
    
    static func updateStatus(bookType: String) {
        // Implementation if needed
    }
    
    static var previews: some View {
        BookStatusView(isPresented: .constant(true), date: .constant(date), selectedStatus: .constant(selectedStatus), updateStatus: updateStatus)
    }
}
