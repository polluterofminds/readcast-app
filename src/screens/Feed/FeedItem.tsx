import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { REACT_APP_API_URL } from "@env"
import { EvilIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Book } from 'types';

const FeedItem = ({ book, handleBookPress }: { book: Book, handleBookPress: Function }) => {
  return (
    <TouchableOpacity onPress={() => handleBookPress(book)}>
      <View className="w-36 mr-2">
        <Image
          className="w-36 h-60 mr-2"
          source={{
            uri: book?.thumbnail
          }}
        />
        <View className="mt-1 overflow-hidden">
          <Text className="text-light italic text-md" numberOfLines={1}>{book?.title}</Text>
          <Text className="text-light text-xs" numberOfLines={1}>{book?.author}</Text>
          <View className="flex flex-row items-center">
            <View className="mt-4 bg-primary rounded-lg p-1 w-10 justify-center flex flex-row items-center">
              <EvilIcons name="comment" size={16} color="#181A1A" />
              <Text className="text-dark" style={{ fontFamily: "Metropolis-Regular" }}>{book.reviews[0].count}</Text>
            </View>
            <Text className="ml-2 text-light text-xs overflow-hidden" numberOfLines={1}>{book?.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FeedItem