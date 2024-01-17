import { Text, View, Image, ScrollView } from 'react-native';
//  @ts-ignore
import { REACT_APP_API_URL } from "@env"
import { FontAwesome5, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Book } from 'types';
import Trending from './Trending';
import Newest from './Newest';
import Fiction from './Fiction';
import { TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import useError from 'hooks/useError';
import { useLibrary } from 'hooks/useLibrary';

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [trending, setTrending] = useState<Book[]>([])
  const [newest, setNewest] = useState<Book[]>([])
  const [fiction, setFiction] = useState<Book[]>([])
  const [selectedTab, setSelectedTab] = useState("trending")
  const [trendingCoords, setTrendingCoords] = useState({x: 0, y: 0})
  const [newestCoords, setNewestCoords] = useState({x: 0, y: 0})
  const [fictionCoords, setFictionCoords] = useState({x: 0, y: 0})

  const navigation: any = useNavigation();

  const scrollViewRef: any = useRef();

  const { submitError } = useError();
  const isFocused = useIsFocused();

  const { fetchLibraryData } = useLibrary();

  useEffect(() => {
    if(isFocused) {
      fetchFeed();
      fetchLibraryData();
    }
  }, [isFocused]);

  const fetchFeed = async () => {
    try {
      const res = await fetch(`${REACT_APP_API_URL}/books/home`)
      const data = await res.json();
      setTrending(data?.trending);
      setFiction(data?.fiction);
      setNewest(data?.newest)
      setLoading(false);
    } catch (error) {
      console.log("Fetching feed error")
      console.log(error);
      submitError(error);
      setLoading(false);
    }
  }

  const handleSelectSection = (section: string) => {
    if(section === "trending") {
      setSelectedTab("trending");
      scrollViewRef.current?.scrollTo({y: trendingCoords.y, animated: true});
    } else if(section === "newest") {
      setSelectedTab("newest");
      scrollViewRef.current?.scrollTo({y: newestCoords.y, animated: true});
    } else if(section === "fiction") {
      setSelectedTab("fiction");
      scrollViewRef.current?.scrollTo({y: fictionCoords.y, animated: true});
    }
  }

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetails', { book });
  };

  return (
    <View className="bg-dark">
      <View className="w-[95%] m-auto">
        <ScrollView ref={scrollViewRef}>          
          {
            loading ?
              <Text>Loading...</Text> :
              <View className="py-6">
                <ScrollView horizontal={true}>
                  <TouchableOpacity onPress={() => handleSelectSection("trending")}><View className={selectedTab === "trending" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="fire" size={24} color={selectedTab === "trending" ? "#181A1A" : "#EAF4F4"} /><Text style={{fontFamily: "Metropolis-Light"}} className={selectedTab === "trending" ? "ml-2 text-md" : "ml-2 text-md text-light"}>Trending</Text></View></TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSelectSection("newest")}><View className={selectedTab === "newest" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><MaterialCommunityIcons name="sprout" size={24} color={selectedTab === "newest" ? "#181A1A" : "#EAF4F4"} /><Text style={{fontFamily: "Metropolis-Light"}} className={selectedTab === "newest" ? "ml-2 text-md" : "ml-2 text-md text-light"}>Newest</Text></View></TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSelectSection("fiction")}><View className={selectedTab === "fiction" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="bookmark" size={24} color={selectedTab === "fiction" ? "#181A1A" : "#EAF4F4"} /><Text style={{fontFamily: "Metropolis-Light"}} className={selectedTab === "fiction" ? "ml-2 text-md" : "ml-2 text-md text-light"}>Fiction</Text></View></TouchableOpacity>
                </ScrollView>
                <Trending handleBookPress={handleBookPress} trending={trending} setTrendingCoords={setTrendingCoords} />
                <Newest handleBookPress={handleBookPress} newest={newest} setNewestCoords={setNewestCoords} />
                <Fiction handleBookPress={handleBookPress} fiction={fiction} setFictionCoords={setFictionCoords} />
              </View>
          }
        </ScrollView>
      </View>
    </View>
  );
}
