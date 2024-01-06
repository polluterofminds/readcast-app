import React from 'react'
import { ImageBackground, TouchableOpacity, View, Image, Text } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import { Book } from 'types';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

interface BookHeaderProps {
  book: Book;
}

const ReviewHeader = ({ book }: BookHeaderProps) => {
  const navigation = useNavigation();
  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={{ uri: book.thumbnail }}
      blurRadius={2}
      className="h-full"
    >
      <View className="h-full flex flex-col justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
          <View className="flex flex-row items-center bg-dark rounded-full p-2 h-10 w-10">
            <FontAwesome name="chevron-left" size={24} color="#EAF4F4" />
          </View>          
        </TouchableOpacity>
        <View className="mx-auto justify-end relative">
          <Image
            className="w-52 h-60 mx-auto justify-end"
            source={{
              uri: book.thumbnail
            }}
          />          
        </View>
      </View>
    </ImageBackground>
  )
}

export default ReviewHeader