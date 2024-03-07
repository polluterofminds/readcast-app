import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, ScrollView, Text, FlatList } from 'react-native'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import useSecureStorage from 'hooks/useSecureStorage';
import { Book } from 'types';
import { useLibrary } from 'hooks/useLibrary';
import LibraryItem from './LibraryItem';
import { FONTS } from 'constants/fonts';
import LibrarySelectorState from './LibraryStateSelector';

export type LibraryWithBook = {
  id: string;
  created_at: string;
  status: string;
  fid: number;
  book_id: string;
  book_type?: string;
  date_completed?: string;
  books: Book, 
  title_author_key: string;
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
    setLibrary([...libraryState.tbr, ...libraryState.inProgress, ...libraryState.completed]);
  }, [libraryState]);

  const handleSelectSection = (selection: string) => {
    setTab(selection)
  }

  const renderList = () => {
    switch (selectedTab) {
      case "tbr":
        return <FlatList
          data={libraryState.tbr}
          renderItem={({ item }) => (
            <LibraryItem item={item} />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 250, margin: "auto", marginTop: 20 }}
        />
      case "in-progress":        
        return <FlatList
          data={libraryState.inProgress}
          renderItem={({ item }) => (
            <LibraryItem item={item} />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 250, margin: "auto", marginTop: 20 }}
        />
      case "completed":
        return <FlatList
          data={libraryState.completed}
          renderItem={({ item }) => (
            <LibraryItem item={item} />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 250, margin: "auto", marginTop: 20 }}
        />
      case "all":
      default:
        return <FlatList
          data={[...libraryState.tbr, ...libraryState.inProgress, ...libraryState.completed]}
          renderItem={({ item }) => (
            <LibraryItem item={item} />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 250, margin: "auto", marginTop: 20 }}
        />
    }
  }

  return (
    <View className="bg-light min-h-screen">
      <View className="w-[95%] mx-auto pb-36">
        <View className="mt-10 px-4">
          <LibrarySelectorState selectedTab={selectedTab} handleSelectSection={handleSelectSection} />
          {/* <ScrollView horizontal={true}>
            <TouchableOpacity onPress={() => handleSelectSection("all")}><View className={selectedTab === "all" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="book" size={24} color={selectedTab === "all" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: FONTS.Light }} className={selectedTab === "all" ? "ml-2 text-md" : "ml-2 text-md text-light"}>All</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectSection("tbr")}><View className={selectedTab === "tbr" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="bookmark" size={24} color={selectedTab === "tbr" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: FONTS.Light }} className={selectedTab === "tbr" ? "ml-2 text-md" : "ml-2 text-md text-light"}>To Be Read</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectSection("in-progress")}><View className={selectedTab === "in-progress" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><MaterialCommunityIcons name="book" size={24} color={selectedTab === "in-progress" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: FONTS.Light }} className={selectedTab === "in-progress" ? "ml-2 text-md" : "ml-2 text-md text-light"}>In Progress</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectSection("completed")}><View className={selectedTab === "completed" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="check" size={24} color={selectedTab === "completed" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: FONTS.Light }} className={selectedTab === "completed" ? "ml-2 text-md" : "ml-2 text-md text-light"}>Completed</Text></View></TouchableOpacity>
          </ScrollView> */}
        </View>
        {renderList()}
      </View>
    </View>
  )
}

export default Library