import React, { memo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Book, LibraryWithBook } from 'types'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from 'constants/fonts';

interface LibraryItemProps {
  item: LibraryWithBook;
}

const LibraryItem = ({ item }: LibraryItemProps) => {
  const navigation = useNavigation();

  const renderBookType = () => {
    if (item.book_type && item.book_type === "audio") {
      return <FontAwesome name="headphones" size={16} color="#92bcb0" />
    }

    if (item.book_type && (item.book_type === "paperback" || item.book_type === "hardcover")) {
      return <FontAwesome name="book" size={16} color="#92bcb0" />
    }

    if (item.book_type && item.book_type === "ebook") {
      return <FontAwesome name="tablet" size={16} color="#92bcb0" />
    }

    return <FontAwesome name="book" size={16} color="#92bcb0" />
  }

  return (
    <TouchableOpacity className="flex-1 m-4 max-w-[40%]" onPress={() => navigation.navigate('BookDetails', { book: item.books, libraryStatus: item })}>

      <Image
        className="w-42 h-60"
        source={{
          uri: item?.books?.thumbnail
        }}
      />
      <View className="mt-4">
        <Text className="text-xl font-bold text-light" style={{ fontFamily: FONTS.Heavy }}>{item?.books?.title}</Text>
        <Text className="text-lg text-light" style={{ fontFamily: FONTS.Middle }}>{item?.books?.author}</Text>
        <Text className="mt-2 text-sm font-bold text-light" style={{ fontFamily: FONTS.Middle }}>{item?.books?.description?.substring(0, 60) + "..."}</Text>
      </View>
      <View className="flex flex-row items-center mt-2">
        {renderBookType()}
        <Text className="ml-2 text-light text-sm uppercase" style={{fontFamily: FONTS.Middle}}>{item.book_type ? item.book_type : "paperback"}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default memo(LibraryItem)