import React from 'react';
import { Text, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { REACT_APP_API_URL } from "@env"
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Book, Review, ReviewWithUser, User } from 'types';
import { TouchableOpacity } from 'react-native';
import BookHeader from './BookHeader';
import BookInfo from "./BookInfo";
import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface BookDetailsProps {
  navigation: NavigationProp<ParamListBase>;
  route: any;
}

export default function BookDetails({ navigation, route }: BookDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const scrollViewRef: any = useRef();
  const { book } = route?.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  useEffect(() => {
    if(book?.title) {
      fetchReviews();
    }    
  }, [book]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${REACT_APP_API_URL}/books/reviews/${encodeURI(book.title)}`)

      const data = await res.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {      
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <View className="bg-dark w-screen">
      <View className="w-full m-auto">
        <ScrollView ref={scrollViewRef} scrollIndicatorInsets={{ right: 1 }}>          
          {
            loading ?
              <Text>Loading...</Text> :
              <SafeAreaView className="py-6 bg-dark min-h-screen" forceInset={{ bottom: 'never', vertical: 'never'}}>
                <View>
                  <BookHeader navigation={navigation} book={book} />
                </View>
                <View>
                  <BookInfo book={book} reviews={reviews} />
                </View>
              </SafeAreaView>
          }
        </ScrollView>
      </View>
    </View>
  );
}
