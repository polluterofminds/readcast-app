import React from 'react';
import { Text, View, ScrollView, SafeAreaView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import BookHeader from './BookHeader';
import BookInfo from "./BookInfo";
import {NavigationProp, ParamListBase, useIsFocused} from '@react-navigation/native';
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
  const isFocused = useIsFocused();
  const { book } = route?.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  useEffect(() => {
    if(book?.title && isFocused) {
      getReviews();
    }    
  }, [isFocused]);

  const getReviews = async () => {
    await fetchReviews(book);
    setLoading(false);
  }

  return (
    <View className="bg-light w-screen">
      <View className="w-full m-auto">
        <ScrollView ref={scrollViewRef} scrollIndicatorInsets={{ right: 1 }}>          
          {
            loading ?
              <Text>Loading...</Text> :
              <View className="bg-light min-h-screen" forceInset={{ bottom: 'never', vertical: 'never'}}>
                <View>
                  <BookHeader navigation={navigation} book={book} />
                </View>
                <View>
                  <BookInfo book={book} reviews={reviews} />
                </View>
              </View>
          }
        </ScrollView>
      </View>
    </View>
  );
}
