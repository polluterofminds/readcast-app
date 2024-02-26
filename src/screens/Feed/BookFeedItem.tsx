import React, { memo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Book } from 'types'
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from 'constants/fonts';

interface BookFeedItemProps {
  book: Book;
  libraryStatus: string 
}

const BookFeedItem = ({ book, libraryStatus }: BookFeedItemProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity className="flex-1 m-4 max-w-[40%]" onPress={() => navigation.navigate('BookDetails', { book, libraryStatus })}>

      <Image
        className="w-42 h-60"
        source={{
          uri: book?.thumbnail
        }}
      />
      <View className="mt-4">
        <Text className="text-xl font-bold text-light" style={{ fontFamily: FONTS.Heavy }}>{book.title}</Text>
        <Text className="text-lg text-light" style={{ fontFamily: FONTS.Middle }}>{book.author}</Text>
        <Text className="mt-2 text-sm font-bold text-light" style={{ fontFamily: FONTS.Middle }}>{book?.description?.substring(0, 60) + "..."}</Text>
      </View>
      <View className="mt-4 bg-primary rounded-lg p-1 w-10 justify-center flex flex-row items-center">
        <EvilIcons name="comment" size={16} color="#181A1A" />
        <Text className="text-dark" style={{ fontFamily: FONTS.Middle }}>{book.reviews}</Text>
      </View>

    </TouchableOpacity>
  )
}

export default memo(BookFeedItem)