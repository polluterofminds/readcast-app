import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import { Book } from 'types'
import ReviewHeader from './ReviewHeader';
import ReviewForm from './ReviewForm';

interface ReviewProps {
  route: any;
}

export type Star = {
  index: number;
  selected: boolean;
}
const Review = ({ route }: ReviewProps) => {
  const [reviewText, setReviewText] = useState("");
  const [stars, setStars] = useState<Star[]>([{
    index: 1, 
    selected: false
  }, 
  {
    index: 2, 
    selected: false
  }, 
  {
    index: 3, 
    selected: false
  }, 
  {
    index: 4, 
    selected: false
  }, 
  {
    index: 5, 
    selected: false
  }])
  const navigation = useNavigation();
  const scrollViewRef: any = useRef();
  const { book } = route?.params;
  return (
    <View className="bg-dark w-screen">
      <ScrollView ref={scrollViewRef} scrollIndicatorInsets={{ right: 1 }}>
        <SafeAreaView className="py-6 bg-dark min-h-screen" forceInset={{ bottom: 'never', vertical: 'never' }}>
          <View>
            <ReviewHeader book={book} />
          </View>
          <View className="mt-4 px-4">
            <ReviewForm stars={stars} setStars={setStars} reviewText={reviewText} setReviewText={setReviewText} />
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  )
}

export default Review