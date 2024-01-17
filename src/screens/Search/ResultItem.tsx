import { Image, View, Text, TouchableOpacity } from 'react-native'
import { Book } from 'types'
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ResultItemProps {
  book: Book;
}

const ResultItem = ({ book }: ResultItemProps) => {
  const navigation = useNavigation();

  const handleSelection = async () => {
    try {
      //  Store the recent search history locally
      const searches = await AsyncStorage.getItem('recent-searches');
      let booksData = searches ? JSON.parse(searches) : [];
      if (!booksData.find((b: Book) => b.id === book.id)) {
        booksData.push(book);
        await AsyncStorage.setItem('recent-searches', JSON.stringify(booksData));
      }
      navigation.navigate('BookDetails', { book })
    } catch (error) {
      console.log("Select book error")
      console.log(error);
    }
  }
  return (
    <View className="mt-2">
      <TouchableOpacity onPress={() => handleSelection()} className="flex flex-row">
        <Image
          className="w-20 h-28"
          source={{
            uri: book?.thumbnail
          }}
        />
        <View className="ml-2 flex flex-col justify-between">
          <View>
            <Text className="text-light text-lg" style={{ fontFamily: "Metropolis-Bold" }}>{book.title}</Text>
            <Text className="text-light text-md italic" style={{ fontFamily: "Metropolis-Regular" }}>{book.author}</Text>
          </View>
          <View className="mt-4 bg-primary rounded-lg p-1 w-10 justify-center flex flex-row items-center">
            <EvilIcons name="comment" size={16} color="#181A1A" />
            <Text className="text-dark" style={{ fontFamily: "Metropolis-Regular" }}>{book?.reviews}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ResultItem