import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Star } from './index';

interface ReviewFormProps {
  reviewText: string;
  setReviewText: Function;
  stars: Star[];
  setStars: Function;
}

const ReviewForm = ({ reviewText, setReviewText, stars, setStars }: ReviewFormProps) => {
  const handleStarSelection = (s: Star) => {
    const cloned = JSON.parse(JSON.stringify(stars));
    cloned[s.index - 1].selected = !s.selected;    
    setStars(cloned);
  }
  return (
    <View>
      <Text className="text-3xl text-light" style={{ fontFamily: "Metropolis-Bold" }}>Add your review</Text>
      <Text className="text-xl text-light" style={{ fontFamily: "Metropolis-Regular" }}>Write a few senteces about your thoughts on this book, star ratings are optional.</Text>
      <View className="mt-4">
        <TextInput onChangeText={(text) => setReviewText(text)} value={reviewText} placeholderTextColor="#dfebeb" className="h-28 text-light text-lg border border-light rounded-md p-4" multiline={true} maxLength={240} placeholder='Your review' style={{ fontFamily: "Metropolis-Regular" }}></TextInput>
        <View className="flex flex-row justify-end">
          <Text className="text-xs text-light" style={{ fontFamily: "Metropolis-Regular" }}>{reviewText.length}/240</Text>
        </View>
        <View className="mt-2">
          <Text className="text-light text-lg" style={{ fontFamily: "Metropolis-Bold" }}>How many stars do you give this book?</Text>
          <View className="flex flex-row justify-around mt-2">
            {
              stars.map((s: any, index: number) => {
                return (
                  <TouchableOpacity onPress={() => handleStarSelection(s)} key={index}>
                    <AntDesign name="staro" size={24} color={s.selected ? "#ffd700" : "#EAF4F4"} />
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>
      </View>
    </View>
  )
}

export default ReviewForm