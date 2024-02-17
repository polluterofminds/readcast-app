import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { Book } from 'types';
import FeedItem from './FeedItem';
import { useNavigation } from '@react-navigation/native';

const Category = ({ books, selectedTab, handleBookPress }: { books: Book[], selectedTab: string, handleBookPress: Function }) => {
  const navigation: any = useNavigation();
  return (
    <View      
      className="pt-6"
    >
      <View className="flex flex-row items-center justify-between w-full">
        <Text style={{fontFamily: "Metropolis-Bold"}} className="font-bold text-xl text-light">{selectedTab.toLocaleUpperCase()}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("FullList", {category: "Trending"})} className="flex flex-row items-center"><Text className="text-primary mr-1" style={{fontFamily: "Metropolis-Bold"}}>Show all</Text><View className="p-1 rounded-full bg-primary border border-dark"><EvilIcons name="chevron-right" size={20} color="#181A1A" /></View></TouchableOpacity>
      </View>
      <ScrollView className="my-4 pr-20">
        {
          books.map((b: Book) => {
            return (
              <FeedItem handleBookPress={handleBookPress} key={b.id} book={b} />
            )
          })
        }
      </ScrollView>
    </View>
  )
}

export default Category