import React, { memo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Book, LibraryWithBook } from 'types'
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface LibraryItemProps {
  item: LibraryWithBook;
}

const LibraryItem = ({ item }: LibraryItemProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity className="flex-1 m-4 max-w-[40%]" onPress={() => navigation.navigate('BookDetails', { book: item.books, libraryStatus: item })}>

      <Image
        className="w-42 h-60"
        source={{
          uri: item?.books?.thumbnail
        }}
      />
      <View className="mt-4">
        <Text className="text-xl font-bold text-light" style={{ fontFamily: "Metropolis-Bold" }}>{item?.books?.title}</Text>
        <Text className="text-lg text-light" style={{ fontFamily: "Metropolis-Regular" }}>{item?.books?.author}</Text>
        <Text className="mt-2 text-sm font-bold text-light" style={{ fontFamily: "Metropolis-Regular" }}>{item?.books?.description?.substring(0, 60) + "..."}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default memo(LibraryItem)