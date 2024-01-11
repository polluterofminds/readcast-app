import React from 'react'
import { LibraryWithBook } from './index'
import { View, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FeedItem from '../Feed/FeedItem'
import BookFeedItem from '../Feed/BookFeedItem'

interface TBRProps {
  tbr: LibraryWithBook[]
}
const TBR = ({ tbr }: TBRProps) => {
  const navigation = useNavigation();
  const handleBookPress = (t: LibraryWithBook) => {
    console.log(t);
  }
  return (
    <View className="pt-6">
      <FlatList
        data={tbr}
        renderItem={({ item }: { item: LibraryWithBook }) => (
          <BookFeedItem book={item.books} libraryStatus={item.status} />
        )}
        keyExtractor={(item: LibraryWithBook) => item.id}
        numColumns={2}
      />
    </View>
  )
}

export default TBR