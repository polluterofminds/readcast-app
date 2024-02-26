import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Book } from 'types';
import { FONTS } from 'constants/fonts';

const FeedItem = ({ book, handleBookPress }: { book: Book, handleBookPress: Function }) => {
  console.log(book?.categories)
  return (
    <TouchableOpacity onPress={() => handleBookPress(book)}>
      <View className="py-2">
        <View className="flex flex-row items-center">
          <Image
            className="flex w-24 h-40 mr-2"
            width={24}
            height={40}
            source={{
              uri: book?.thumbnail
            }}
          />
          <View className="mt-1 overflow-hidden">
            <Text className="text-dark text-xs overflow-hidden" numberOfLines={1}>{book?.categories.toUpperCase()}</Text>
            <Text className="text-dark font-bold italic text-md" numberOfLines={1}>{book?.title}</Text>
            <Text className="text-dark text-xs" numberOfLines={1}>{book?.author}</Text>
            <Text className="text-dark text-xs" numberOfLines={4}>{book?.description}</Text>
            <View className="flex flex-row items-center">
              <View className="mt-4 bg-primary rounded-full py-1 px-2 justify-center flex flex-row items-center">
                <EvilIcons name="comment" size={16} color="#181A1A" />
                <Text className="text-dark text-xs mt-1" style={{ fontFamily: FONTS.Middle }}>{book.reviews}</Text>
              </View>              
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FeedItem