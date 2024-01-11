import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, SafeAreaView, ScrollView, Text } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontAwesome5, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import useSecureStorage from 'hooks/useSecureStorage';
import { REACT_APP_API_URL } from "@env";
import { StorageKeys } from 'constants/storageKeys';
import { Book } from 'types';
import TBR from './TBR';

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

type Library = {
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
  const [selectedTab, setTab] = useState("tbr");
  const [library, setLibrary] = useState<Library>(initialLibrary)
  const navigation = useNavigation();
  const { getSecureValue } = useSecureStorage();
  const scrollViewRef: any = useRef();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadLibrary();
    }
  }, [isFocused]);

  const handleSelectSection = (selection: string) => {
    setTab(selection);
  }

  const loadLibrary = async () => {
    const signerUUID = await getSecureValue(StorageKeys.SIGNING_KEY)
    const res = await fetch(`${REACT_APP_API_URL}/books/library`, {
      headers: {
        'Authorization': `Bearer ${signerUUID}`
      }
    })

    const libResponse = await res.json();
    setLibrary(libResponse)
  }

  const renderScreen = () => {
    if (selectedTab === "in-progress") {

    } else if (selectedTab === "completed") {

    }

    return <TBR tbr={library?.tbr} />
  }

  return (
    <View className="bg-dark">
      <View className="w-[95%] m-auto">
        <SafeAreaView className="bg-dark min-h-screen" forceInset={{ bottom: 'never', vertical: 'never' }}>
          <View className="mt-10 px-4">
            <View>
              <Text className="text-3xl font-bold text-light mt-6">Library</Text>
              <View className="w-[28%] border-b-4 border-primary mb-6"></View>
            </View>
            <ScrollView horizontal={true}>
              <TouchableOpacity onPress={() => handleSelectSection("tbr")}><View className={selectedTab === "tbr" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="bookmark" size={24} color={selectedTab === "tbr" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: "Metropolis-Light" }} className={selectedTab === "tbr" ? "ml-2 text-md" : "ml-2 text-md text-light"}>To Be Read</Text></View></TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectSection("in-progress")}><View className={selectedTab === "in-progress" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><MaterialCommunityIcons name="book" size={24} color={selectedTab === "in-progress" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: "Metropolis-Light" }} className={selectedTab === "in-progress" ? "ml-2 text-md" : "ml-2 text-md text-light"}>In Progress</Text></View></TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectSection("completed")}><View className={selectedTab === "completed" ? "flex flex-row items-center px-6 py-2 rounded rounded-full bg-primary mr-2" : "flex flex-row items-center px-6 py-2 rounded rounded-full bg-transparent border border-light mr-2"}><FontAwesome5 name="check" size={24} color={selectedTab === "completed" ? "#181A1A" : "#EAF4F4"} /><Text style={{ fontFamily: "Metropolis-Light" }} className={selectedTab === "completed" ? "ml-2 text-md" : "ml-2 text-md text-light"}>Completed</Text></View></TouchableOpacity>
            </ScrollView>
          </View>
          <View>
            <TBR tbr={library?.tbr} />
          </View>
        </SafeAreaView>
      </View>
    </View>
  )
}

export default Library