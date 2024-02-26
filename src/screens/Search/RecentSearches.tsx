import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Book } from 'types'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResultItem from './ResultItem';
import { FONTS } from 'constants/fonts';


const RecentSearches = () => {
  const [recent, setRecent] = useState<Book[]>([]);
  useEffect(() => {
    loadRecentSearches()
  }, []);

  const loadRecentSearches = async () => {
    const searches = await AsyncStorage.getItem('recent-searches');
    let booksData = searches ? JSON.parse(searches) : [];
    setRecent(booksData);
  }

  const clearHistory = async () => {
    setRecent([]);
    await AsyncStorage.setItem('recent-searches', JSON.stringify([]));
  }
  return (
    <View className="mt-4">
      <View className="flex flex-row justify-between mb-4 items-center">
        <Text className="text-light font-bold text-xl" style={{fontFamily: FONTS.Heavy}}>Recent searches</Text>
        <TouchableOpacity onPress={clearHistory}><Text className="text-lightest text-sm">Clear history</Text></TouchableOpacity>
      </View>      
      <FlatList
        data={recent}
        renderItem={({ item }: { item: Book}) => (
          <ResultItem book={item} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default RecentSearches