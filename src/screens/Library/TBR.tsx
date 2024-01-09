import React from 'react'
import { LibraryWithBook } from './index'
import { View, TouchableOpacity, ScrollView, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FeedItem from '../Feed/FeedItem'

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
      <ScrollView className="my-4 pr-20" horizontal={true}>
        {
          tbr.map((t: LibraryWithBook) => {
            return (
              <FeedItem handleBookPress={() => handleBookPress(t)} key={t.id} book={t.books} />
            )
          })
        }
      </ScrollView>
    </View>
  )
}

export default TBR