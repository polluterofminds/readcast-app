import React from 'react'
import { Image, View, Text } from 'react-native';
import { ReviewWithUser } from 'types'
import { Ionicons } from '@expo/vector-icons';

interface ReviewItemProps {
  review: ReviewWithUser;
}
const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <View className="flex flex-row items-center bg-accent p-2 rounded-lg mt-2">
      {
        review?.users?.pfp ?
          <Image
            className="w-20 h-20 rounded-full"
            source={{
              uri: review.users.pfp
            }}
          /> :
          <Ionicons
            name="person-outline"
            size={24}
            color="#EAF4F4"
          />
      }
      <View className="ml-4" style={{ flexShrink: 1 }}>
        <Text style={{fontFamily: "Metropolis-Bold", flexShrink: 1}} className="text-lg font-semibold text-light">{review?.users?.display_name || review?.users?.username}</Text>
        <Text style={{fontFamily: "Metropolis-Regular", flexShrink: 1}} className="text-light text-md">{review?.users?.display_name && review?.users?.username ? review?.users?.username : review?.users?.fid}</Text>
        <Text style={{fontFamily: "Metropolis-Regular", flexShrink: 1}} className="mt-2 text-light text-md">{review.review}</Text>
      </View>
    </View>
  )
}

export default ReviewItem