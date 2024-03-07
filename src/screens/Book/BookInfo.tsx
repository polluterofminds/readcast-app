import React from 'react'
import { View, Text } from 'react-native';
import { Book, Review, ReviewWithUser } from 'types';
import ReviewItem from './ReviewItem';
import { FONTS } from 'constants/fonts';

interface BookDetailsProps {
  book: Book;
  reviews: ReviewWithUser[]
}

const BookInfo = ({ book, reviews }: BookDetailsProps) => {
  return (
    <View className="pt-10 px-4 pb-10">
      <Text style={{ fontFamily: FONTS.Heavy }} className="text-3xl font-bold text-dark">{book.title}</Text>
      <Text style={{ fontFamily: FONTS.Middle }} className="text-lg text-dark">{book.author}</Text>
      <View className="mt-4 mb-4">
        <Text style={{ fontFamily: FONTS.Heavy }} className="text-2xl text-dark font-bold">About this book</Text>
        <Text style={{ fontFamily: FONTS.Middle }} className="text-lg text-dark">{book.description}</Text>
      </View>
      <View className="bg-light border border-dark rounded-xl mt-4 m-auto px-4 py-2">
        <Text className="text-dark text-lg" style={{ fontFamily: FONTS.Middle }}>{book.category || book.categories}</Text>
      </View>

      <View className="mt-6">
        <Text style={{ fontFamily: FONTS.Heavy }} className="text-3xl text-dark">{reviews.length} reviews</Text>
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