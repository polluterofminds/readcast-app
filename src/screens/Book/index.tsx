import React from 'react';
import { Text, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { REACT_APP_API_URL } from "@env"
import { useEffect, useRef, useState } from 'react';
import { ReviewWithUser } from 'types';
import BookHeader from './BookHeader';
import BookInfo from "./BookInfo";
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import useError from 'hooks/useError';
import useReviews from 'hooks/useReviews';

interface BookDetailsProps {
  navigation: NavigationProp<ParamListBase>;
  route: any;
}

export default function BookDetails({ navigation, route }: BookDetailsProps) {
  const [loading, setLoading] = useState(true);
  const scrollViewRef: any = useRef();
  const { reviews, fetchReviews } = useReviews();
  const { book } = route?.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  useEffect(() => {
    if(book?.title) {
      getReviews();
    }    
  }, [book]);

  const getReviews = async () => {
    await fetchReviews(book);
    setLoading(false);
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
