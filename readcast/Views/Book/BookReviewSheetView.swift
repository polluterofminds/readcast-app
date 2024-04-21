//
//  BookReviewSheetView.swift
//  readcast
//
//  Created by Justin Hunter on 4/20/24.
//

import SwiftUI

struct BookReviewSheetView: View {
    @Binding var isPresented: Bool
    @Binding var castText: String
    @Binding var submitting: Bool
    @FocusState private var isTextFieldFocused: Bool
    
    var submitCast: () -> Void

    var body: some View {
        VStack {
            // Header
            HStack {
                Button("Cancel") {
                    isPresented = false
                    castText = ""
                }
                .foregroundColor(.black)
                Spacer()
                if !submitting {
                    Button(action: {
                        submitCast()
                    }) {
                        Text("Submit")
                            .foregroundColor(.white)
                            .padding()
                            .background(.black)
                            .cornerRadius(10)
                    }
                    .padding(.vertical)
                } else {
                    Spacer()
                }
            }
            .padding()
            .frame(maxWidth: .infinity)
            
            // Text Field or Submission Status
            if submitting {
                // Submission in progress
                SubmissionInProgressView()
            } else {
                VStack {
                    if castText.isEmpty && isTextFieldFocused == false {
                        HStack {
                            Text("Add comment")
                                .foregroundColor(.gray)
                                .padding()
                            Spacer()
                        }
                    }
                    TextField("", text: $castText)
                        .foregroundColor(.black)
                        .onSubmit {
                            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                            isTextFieldFocused = false
                        }
                        .submitLabel(.send)
                        .padding()
                    Spacer()
                }
                .frame(width: UIScreen.main.bounds.width * 0.80, height: UIScreen.main.bounds.height * 0.35)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.gray, lineWidth: 1)
                )
            }
            Spacer()
        }
        .frame(maxWidth: UIScreen.main.bounds.width * 0.90, maxHeight: .infinity)
        .background(Color.white)
        .padding()
        .onAppear {
            // Ensure focus state is updated when view appears
            isTextFieldFocused = true
        }
        .toolbar {
            ToolbarItem(placement: .keyboard) {
                // Show "Done" button when text field is focused
                if isTextFieldFocused {
                    Button("Done") {
                        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                        isTextFieldFocused = false // Reset focus state
                    }
                }
            }
        }
        .onTapGesture {
            // Dismiss keyboard when tapped outside text field
            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
            isTextFieldFocused = false // Reset focus state
        }
        .animation(.spring())
    }
}

struct SubmissionInProgressView: View {
    var body: some View {
        VStack {
            Spacer()
            Text("Submitting comment...")
                .foregroundColor(.black)
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .black))
            Spacer()
        }
    }
}

struct BookReviewSheetView_Previews: PreviewProvider {
    static func submitCast() {
        // Implementation if needed
    }
    static var previews: some View {
        BookReviewSheetView(isPresented: .constant(true), castText: .constant(""), submitting: .constant(false), submitCast: submitCast)
    }
}
