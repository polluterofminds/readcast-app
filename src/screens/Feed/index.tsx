import { Text, View, Image, ScrollView } from 'react-native';
//  @ts-ignore
import { REACT_APP_API_URL } from "../../../config"
import { useEffect, useRef, useState } from 'react';
import { Book } from 'types';
import Trending from './Trending';
import Newest from './Newest';
import Fiction from './Fiction';
import { TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import useError from 'hooks/useError';
import { useLibrary } from 'hooks/useLibrary';
import Constants from 'expo-constants'
import CategorySelector from './CategorySelector';
import Category from './Category';
// const apiUrl = Constants?.expoConfig?.hostUri
// ? `http://${Constants?.expoConfig?.hostUri?.split(`:`)?.shift()?.concat(`:3000`)}`
// : REACT_APP_API_URL
const apiUrl = REACT_APP_API_URL;

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [trending, setTrending] = useState<Book[]>([])
  const [newest, setNewest] = useState<Book[]>([])
  const [fiction, setFiction] = useState<Book[]>([])
  const [business, setBusiness] = useState<Book[]>([])
  const [biography, setBiography] = useState<Book[]>([])
  const [selectedTab, setSelectedTab] = useState("trending")


  const navigation: any = useNavigation();

  const scrollViewRef: any = useRef();

  const { submitError } = useError();
  const isFocused = useIsFocused();

  const { fetchLibraryData } = useLibrary();

  useEffect(() => {
    if(isFocused && apiUrl) {
      fetchFeed();
      fetchLibraryData();
    }
  }, [isFocused, apiUrl]);

  const fetchFeed = async () => {
    try {
      const res = await fetch(`${apiUrl}/books/home`)
      const data = await res.json();
      setTrending(data?.trending);
      setFiction(data?.fiction);
      setNewest(data?.newest);
      setBusiness(data?.business);
      setBiography(data?.biography);
      setLoading(false);
    } catch (error) {
      console.log("Fetching feed error")
      console.log(error);
      submitError(error);
      setLoading(false);
    }
  }

  const handleSelectSection = (section: string) => {
    setSelectedTab(section);
  }

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetails', { book });
  };

  const getResults = () => {
    switch(selectedTab) {
      case "newest": 
        return newest;
      case "fiction": 
        return fiction;
      case "business": 
        return business;
      case "biography": 
        return biography;
      case "trending":
      default: 
        return trending;
    }
  }

  return (
    <View className="bg-dark">
      <View className="w-[95%] m-auto">
        <ScrollView ref={scrollViewRef}>          
          {
            loading ?
              <Text>Loading...</Text> :
              <View className="py-6">
                <CategorySelector handleSelectSection={handleSelectSection} selectedTab={selectedTab} />
                <Category handleBookPress={handleBookPress} books={getResults()} selectedTab={selectedTab} />
                {/* <Trending handleBookPress={handleBookPress} trending={trending} setTrendingCoords={setTrendingCoords} />
                <Newest handleBookPress={handleBookPress} newest={newest} setNewestCoords={setNewestCoords} />
                <Fiction handleBookPress={handleBookPress} fiction={fiction} setFictionCoords={setFictionCoords} /> */}
              </View>
          }
        </ScrollView>
      </View>
    </View>
  );
}
