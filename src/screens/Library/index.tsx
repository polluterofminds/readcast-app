import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, SafeAreaView, ScrollView, Text } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontAwesome5, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import useSecureStorage from 'hooks/useSecureStorage';
import { REACT_APP_API_URL } from "@env";
import { StorageKeys } from 'constants/storageKeys';
import { Book } from 'types';
import Results from './Results';
import { useLibrary } from 'hooks/useLibrary';
import BookFeed from '../Feed/BookFeed';
import LibraryItem from './LibraryItem';
import { FlatList } from 'react-native-gesture-handler';

export type LibraryWithBook = {
  id: string;
  created_at: string;
  status: string;
  fid: number;
  book_id: string;
  book_type?: string;
  date_completed?: string;
  books: Book
}

type LibraryState = {
  tbr: LibraryWithBook[];
  inProgress: LibraryWithBook[];
  completed: LibraryWithBook[];
}

const initialLibrary = {
  tbr: [],
  inProgress: [],
  completed: []
}

const Library = () => {
  const [selectedTab, setTab] = useState("all");
  const [library, setLibrary] = useState<LibraryWithBook[]>([]);
  const navigation = useNavigation();
  const { getSecureValue } = useSecureStorage();
  const scrollViewRef: any = useRef();
  const isFocused = useIsFocused();
  const { fetchLibraryData, libraryState } = useLibrary();

  useEffect(() => {
    if (isFocused) {
      fetchLibraryData();
    }
  }, [isFocused]);

  useEffect(() => {
    setLibrary([...libraryState.tbr.slice(0, 3), ...libraryState.inProgress.slice(0, 3), ...libraryState.completed.slice(0, 3)]);
  }, [libraryState]);

  const handleSelectSection = (selection: string) => {
    setTab(selection)
    switch (selection) {
      case "in-progress":
        return setLibrary(libraryState.inProgress)
      case "completed":
        setLibrary(libraryState.completed)
      case "tbr":
        return setLibrary(libraryState.tbr)
      default:
        return setLibrary([...libraryState.tbr.slice(0, 3), ...libraryState.inProgress.slice(0, 3), ...libraryState.completed.slice(0, 3)])
    }
  }

  return (
    <View className="bg-dark min-h-screen">
      <View className="w-[95%] mx-auto pb-36">
        <View className="mt-10 px-4">
          <ScrollView horizontal={true}>
            <TouchableOpacity onPress={() => handleSelectSection("all")}><View className={selectedTab === "all" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="book" size={24} color={selectedTab === "all" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: "Metropolis-Light" }} className={selectedTab === "all" ? "ml-2 text-md" : "ml-2 text-md text-light"}>All</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectSection("tbr")}><View className={selectedTab === "tbr" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="bookmark" size={24} color={selectedTab === "tbr" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: "Metropolis-Light" }} className={selectedTab === "tbr" ? "ml-2 text-md" : "ml-2 text-md text-light"}>To Be Read</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectSection("in-progress")}><View className={selectedTab === "in-progress" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><MaterialCommunityIcons name="book" size={24} color={selectedTab === "in-progress" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: "Metropolis-Light" }} className={selectedTab === "in-progress" ? "ml-2 text-md" : "ml-2 text-md text-light"}>In Progress</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectSection("completed")}><View className={selectedTab === "completed" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="check" size={24} color={selectedTab === "completed" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: "Metropolis-Light" }} className={selectedTab === "completed" ? "ml-2 text-md" : "ml-2 text-md text-light"}>Completed</Text></View></TouchableOpacity>
          </ScrollView>
        </View>        
          <FlatList
            data={library}
            renderItem={({ item }) => (
              <LibraryItem item={item} />
            )}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: 250, margin: "auto", marginTop: 20 }}
          />
        </View>
    </View>
  )
}

export default Library