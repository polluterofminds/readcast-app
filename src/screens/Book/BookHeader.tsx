import React from 'react'
import { ImageBackground, TouchableOpacity, View, Image, Text } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import { Book } from 'types';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

interface BookHeaderProps {
  book: Book;
  navigation: NavigationProp<ParamListBase>;
}

const BookHeader = ({ book, navigation }: BookHeaderProps) => {
  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={{ uri: book.thumbnail }}
      blurRadius={2}
      className="h-full"
    >
      <View className="h-full flex flex-col justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
          <FontAwesome name="chevron-left" size={24} color="#EAF4F4" />
        </TouchableOpacity>
        <View className="mx-auto justify-end relative">
          <Image
            className="w-52 h-60 mx-auto justify-end"
            source={{
              uri: book.thumbnail
            }}
          />          
        </View>
        <View className="absolute -bottom-4 w-[90%] left-[5%] m-auto">
            <View className="flex w-full flex-row bg-accent py-4 px-6 rounded-md m-auto justify-center">
              <TouchableOpacity>
                <View className="flex flex-row items-center">
                  <Foundation name="book-bookmark" size={24} color="#EAF4F4" />
                  <Text style={{fontFamily: "Metropolis-Bold"}} className="mx-2 text-lg font-bold text-light">Want to read</Text>
                </View>
              </TouchableOpacity>
              <Text className="text-light mx-4 text-2xl" style={{fontFamily: "Metropolis-Light"}}>|</Text>
              <TouchableOpacity>
                <View className="flex flex-row items-center">
                  <AntDesign name="staro" size={24} color="#EAF4F4" />
                  <Text style={{fontFamily: "Metropolis-Bold"}} className="mx-2 text-lg font-bold text-light">Add review</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
      </View>
    </ImageBackground>
  )
}

export default BookHeader