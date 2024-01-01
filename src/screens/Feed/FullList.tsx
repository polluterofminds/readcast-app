import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, SafeAreaView, ScrollView, Text } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Book } from 'types';
import BookFeed from './BookFeed';
import { REACT_APP_API_URL } from "@env"
import useError from 'hooks/useError';

interface FullListProps {
  route: any;
}

const FullList = ({ route }: FullListProps) => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([])
  const { category } = route?.params;
  const navigation = useNavigation();
  const { submitError } = useError();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await fetch(`${REACT_APP_API_URL}/books/${category}`);
      const data = await res.json();
      setBooks(data)
      setLoading(false);
    } catch (error) {
      console.log(error);
      submitError(error);
      setLoading(false);
    }
  }

  return (
    <View className="w-screen p-4 bg-dark">
      <SafeAreaView style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
          <View className="flex flex-row items-center bg-dark rounded-full p-2 h-10 w-10">
            <FontAwesome name="chevron-left" size={24} color="#EAF4F4" />
          </View>
        </TouchableOpacity>
        <Text className="text-light font-bold text-2xl" style={{ fontFamily: "Metropolis-Bold" }}>{category}</Text>
      </SafeAreaView>
      <View>
        {
          loading ?
            <Text className="text-light" style={{ fontFamily: "Metropolis-Regular" }}>Loading...</Text> :
            <BookFeed books={books} />
        }
      </View>
    </View>
  )
}

export default FullList