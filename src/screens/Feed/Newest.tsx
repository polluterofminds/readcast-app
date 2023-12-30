import { Text, View, Image, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { REACT_APP_API_URL } from "@env"
import { EvilIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Book } from 'types';
import FeedItem from './FeedItem';

const Newest = ({ newest, setNewestCoords, handleBookPress } : { newest: Book[], setNewestCoords: Function, handleBookPress: Function}) => {
  return (
    <View 
      className="pt-6"
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;        
        setNewestCoords({x: layout.x, y: layout.y})
      }}
    >
      <View className="flex flex-row items-center justify-between w-full">
        <Text className="font-bold text-xl text-light" style={{fontFamily: "Metropolis-Bold"}}>Newest</Text>
        <TouchableOpacity className="flex flex-row items-center"><Text className="text-primary mr-1" style={{fontFamily: "Metropolis-Bold"}}>Show all</Text><View className="p-1 rounded-full bg-primary border border-dark"><EvilIcons name="chevron-right" size={20} color="#181A1A" /></View></TouchableOpacity>
      </View>  
      <ScrollView className="my-4 pr-20" horizontal={true}>
        {
          newest.map((b: Book) => {
            return (
              <FeedItem handleBookPress={handleBookPress} key={b.title} book={b} />
            )
          })
        }
      </ScrollView>    
    </View>
  )
}

export default Newest