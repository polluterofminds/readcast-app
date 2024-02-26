import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Star } from './index';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Book, LibraryWithBook } from 'types';
import useError from 'hooks/useError';
import { useNavigation } from '@react-navigation/native';
import useReviews from 'hooks/useReviews';
import useToast from 'hooks/useToast';
import { useLibrary } from 'hooks/useLibrary';
import { FONTS } from 'constants/fonts';

interface ReviewFormProps {
  book: Book;
  libraryBook?: LibraryWithBook;
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

const ReviewForm = ({ book, libraryBook }: ReviewFormProps) => {
  const [reviewText, setReviewText] = useState("");
  const [stars, setStars] = useState<Star[]>(initialRating)
  const [markComplete, setMarkComplete] = useState(false);
  const [hasDateChanged, setHasDateChanged] = useState(false);
  const [date, setDate] = useState<any>(dayjs());
  const [submitting, setSubmitting] = useState(false);
  const { submitError } = useError();
  const { castReview } = useReviews();
  const navigation = useNavigation();
  const { setToastMessage, hideToastMessage } = useToast();
  const { addToLibrary, updateLibraryStatus } = useLibrary();
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
    if (!reviewText) {
      return true
    }

    return false;
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setToastMessage("info", "Submitting review...");
      if (markComplete && libraryBook) {        
        const res = await updateLibraryStatus("completed", libraryBook, book, {
          date_completed: hasDateChanged ? date : null, 
          status: "completed"
        });
        if(!res.ok) {
          throw new Error("Trouble submitting review")
        }
      } else if(markComplete) {        
        const res = await addToLibrary(book, { status: "completed", date_completed: hasDateChanged ? date : null })
        if(!res.ok) {
          throw new Error("Trouble submitting review")
        }
      }
      //  Post review
      let starRatings = ""
      if (stars.filter((s: Star) => s.selected).length > 0) {
        stars.filter((s: Star) => s.selected).forEach((s: Star) => { starRatings = starRatings + "⭐️" })
      }
      let text = `${book.title} by ${book.author} review: \n${reviewText}\n${starRatings && starRatings}`
      await castReview(text, book, stars.filter((s: Star) => s.selected).length)
      setToastMessage("success", "Review added");
      setTimeout(() => {
        hideToastMessage();
        clear();
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.log("Submit review error")
      console.log(error);
      submitError(error);
      setSubmitting(false);
    }
  }

  const handleDateChange = (d: DateType) => {
    setDate(d);
    setHasDateChanged(true);
  }

  const clear = () => {
    setReviewText("");
    setStars(initialRating);
    setMarkComplete(false);
    setSubmitting(false);
  }

  return (
    <View className="pb-8">
      <Text className="text-3xl text-light" style={{ fontFamily: FONTS.Heavy }}>Add your review</Text>
      <Text className="text-xl text-light" style={{ fontFamily: FONTS.Middle }}>Write a few senteces about your thoughts on this book, star ratings are optional.</Text>
      <View className="mt-4">
        <TextInput onChangeText={(text) => setReviewText(text)} value={reviewText} placeholderTextColor="#dfebeb" className="h-28 text-light text-lg border border-light rounded-md p-4" multiline={true} maxLength={240} placeholder='Your review' style={{ fontFamily: FONTS.Middle }}></TextInput>
        <View className="flex flex-row justify-end">
          <Text className="text-xs text-light" style={{ fontFamily: FONTS.Middle }}>{reviewText.length}/240</Text>
        </View>
        <View className="mt-2">
          <Text className="text-light text-lg" style={{ fontFamily: FONTS.Heavy }}>How many stars do you give this book?</Text>
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
          {
            (!libraryBook || libraryBook.status !== "completed") &&
            <View className="flex flex-row items-center mt-4">
              <Switch
                trackColor={{ false: '#767577', true: '#767577' }}
                thumbColor={markComplete ? '#92bcb0' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleComplete}
                value={markComplete}
              />
              <Text className="ml-2 text-lg text-light" style={{ fontFamily: FONTS.Heavy }}>Mark as read in your library?</Text>
            </View>
          }
          {
            markComplete &&
            <View className="mt-4 pb-6">
              <Text className="ml-2 text-lg text-light" style={{ fontFamily: FONTS.Heavy }}>Date finished (optional)</Text>
              <View className="mt-2 bg-lightest text-dark rounded-md">
                <DateTimePicker
                  value={date}
                  onValueChange={(d) => handleDateChange(d)}
                />
              </View>
            </View>
          }
          <View className="mt-6 flex flex-row justify-end">
            <TouchableOpacity onPress={() => handleSubmit()} disabled={isDisabled()} className={isDisabled() ? "w-44 rounded-md px-4 py-2 bg-lightest" : "bg-primary w-44 rounded-md px-4 py-2"}>
              <Text className="text-center text-dark" style={{ fontFamily: FONTS.Heavy }}>Add review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ReviewForm