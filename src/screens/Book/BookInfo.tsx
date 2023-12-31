import React from 'react'
import { View, Text } from 'react-native';
import { Book, Review, ReviewWithUser } from 'types';
import ReviewItem from './ReviewItem';

interface BookDetailsProps {
  book: Book;
  reviews: ReviewWithUser[]
}

const BookInfo = ({ book, reviews }: BookInfoProps) => {
  return (
    <View className="pt-10 px-4 pb-10">
      <Text style={{ fontFamily: "Metropolis-Bold" }} className="text-3xl font-bold text-light">{book.title}</Text>
      <Text style={{ fontFamily: "Metropolis-Regular" }} className="text-lg text-light">{book.author}</Text>
      <View className="mt-4 mb-4">
        <Text style={{ fontFamily: "Metropolis-Bold" }} className="text-2xl text-light font-bold">About this book</Text>
        <Text style={{ fontFamily: "Metropolis-Regular" }} className="text-lg text-light">{book.description}</Text>
      </View>
      <View className="bg-pill rounded-xl mt-4 m-auto px-4 py-2">
        <Text className="text-light text-lg" style={{ fontFamily: "Metropolis-Regular" }}>{book.category}</Text>
      </View>

      <View className="mt-6">
        <Text style={{ fontFamily: "Metropolis-Bold" }} className="text-3xl text-light">{reviews.length} reviews</Text>
        <View>
          {
            reviews.map((r: ReviewWithUser) => {
              return (
                <ReviewItem key={r.id} review={r} />
              )
            })
          }
        </View>
      </View>

    </View>
  )
}

export default BookInfo