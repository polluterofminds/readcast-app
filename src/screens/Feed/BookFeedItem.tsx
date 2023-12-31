import React, { memo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Book } from 'types'
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface BookFeedItemProps {
  book: Book
}

const BookFeedItem = ({ book }: BookFeedItemProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity className="flex-1 m-4" onPress={() => navigation.navigate('BookDetails', { book })}>

      <Image
        className="w-42 h-60"
        source={{
          uri: book?.thumbnail
        }}
      />
      <View className="mt-4">
        <Text className="text-xl font-bold text-light" style={{ fontFamily: "Metropolis-Bold" }}>{book.title}</Text>
        <Text className="text-lg text-light" style={{ fontFamily: "Metropolis-Regular" }}>{book.author}</Text>
        <Text className="mt-2 text-sm font-bold text-light" style={{ fontFamily: "Metropolis-Regular" }}>{book?.description?.substring(0, 60) + "..."}</Text>
      </View>
      <View className="mt-4 bg-primary rounded-lg p-1 w-10 justify-center flex flex-row items-center">
        <EvilIcons name="comment" size={16} color="#181A1A" />
        <Text className="text-dark" style={{ fontFamily: "Metropolis-Regular" }}>{book.reviews}</Text>
      </View>

    </TouchableOpacity>
  )
}

export default memo(BookFeedItem)