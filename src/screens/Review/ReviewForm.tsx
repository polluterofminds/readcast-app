import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Star } from './index';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Book } from 'types';
import useError from 'hooks/useError';
import useWarpcastConnection from 'hooks/useWarpcast';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useNavigation } from '@react-navigation/native';
import useReviews from 'hooks/useReviews';

interface ReviewFormProps {
  book: Book;
}

const initialRating = [{
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
}]

const ReviewForm = ({ book }: ReviewFormProps) => {
  const [reviewText, setReviewText] = useState("");
  const [stars, setStars] = useState<Star[]>(initialRating)
  const [markComplete, setMarkComplete] = useState(false);
  const [date, setDate] = useState<any>(dayjs());
  const [submitting, setSubmitting] = useState(false);
  const { submitError } = useError();
  const { castReview } = useReviews();
  const navigation = useNavigation();

  const handleStarSelection = (s: Star) => {
    const cloned = JSON.parse(JSON.stringify(stars));
    const index = s.index;
    cloned.forEach((star: Star) => {
      if (star.index <= index) {
        star.selected = true;
      } else {
        star.selected = false;
      }
    })
    setStars(cloned);
  }

  const handleClear = () => {
    const cloned = JSON.parse(JSON.stringify(stars));
    cloned.forEach((s: Star) => {
      s.selected = false;
    })
    setStars(cloned);
  }

  const toggleComplete = () => setMarkComplete(previousState => !previousState);

  const isDisabled = () => {
    if(!reviewText) {
      return true
    }

    return false;
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      showMessage({
        message: "Submitting review...", 
        type: "info"
      })
      if(markComplete) {
        //  Add book to library
      } 
      //  Post review
      let starRatings = ""
      if(stars.filter((s: Star) => s.selected).length > 0) {
        stars.filter((s: Star) => s.selected).forEach((s: Star) => {starRatings = starRatings + "⭐️"})
      } 
      let text = `${book.title} by ${book.author} review: \n${reviewText}\n${starRatings && starRatings}`
      await castReview(text, book, stars.filter((s: Star) => s.selected).length)
      showMessage({
        message: "Review added!",
        type: "success",
      });
      setTimeout(() => {
        hideMessage();
        clear();
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.log(error);
      submitError(error);
      setSubmitting(false);
    }    
  }

  const clear = () => {
    setReviewText("");
    setStars(initialRating);
    setMarkComplete(false);
    setSubmitting(false);
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
          <View className="flex flex-row justify-end">
            <TouchableOpacity onPress={() => handleClear()} className="m-4"><Text className="text-xs text-light">Clear</Text></TouchableOpacity>
          </View>
          <View className="flex flex-row items-center mt-4">
            <Switch
              trackColor={{ false: '#767577', true: '#767577' }}
              thumbColor={markComplete ? '#92bcb0' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleComplete}
              value={markComplete}
            />
            <Text className="ml-2 text-lg text-light" style={{ fontFamily: "Metropolis-Bold" }}>Mark as read in your library?</Text>
          </View>
          {
            markComplete &&
            <View className="mt-4 pb-6">
              <Text className="ml-2 text-lg text-light" style={{ fontFamily: "Metropolis-Bold" }}>Date finished</Text>
              <View className="mt-2 bg-lightest text-dark rounded-md">
                <DateTimePicker
                  value={date}
                  onValueChange={(d) => setDate(d)}                
                />              
              </View>
            </View>
          }
          <View className="mt-6 flex flex-row justify-end">
            <TouchableOpacity onPress={() => handleSubmit()} disabled={isDisabled()} className={isDisabled() ? "w-44 rounded-md px-4 py-2 bg-lightest" : "bg-primary w-44 rounded-md px-4 py-2"}>
              <Text className="text-center text-dark" style={{fontFamily: "Metropolis-Bold"}}>Add review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ReviewForm