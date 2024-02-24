import React, { useEffect, useState } from 'react'
import { ImageBackground, TouchableOpacity, View, Image, Text, Modal, ScrollView } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import { Book } from 'types';
import { NavigationProp, ParamListBase, useIsFocused } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import useWarpcastConnection from 'hooks/useWarpcast';
//  @ts-ignore
import { REACT_APP_API_URL } from "../../../config";
import { LibraryWithBook } from '../Library';
import { useLibrary } from 'hooks/useLibrary';
import { useUser } from 'hooks/useUser';
import { Entypo } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  // renderers
} from 'react-native-popup-menu';
import useSecureStorage from 'hooks/useSecureStorage';
import { StorageKeys } from 'constants/storageKeys';
import useToast from 'hooks/useToast';
import CorrectionsModal from './CorrectionsModal';
import LibraryModal from './LibraryModal';
import LibraryAction from './LibraryAction';

const apiUrl = REACT_APP_API_URL;

interface BookHeaderProps {
  book: Book;
  navigation: NavigationProp<ParamListBase>;
  library?: LibraryWithBook;
}

const BookHeader = ({ book, navigation }: BookHeaderProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [correctionModalVisible, setCorrectionModalVisible] = useState(false);
  const [newStatus, setStatus] = useState("");
  const [libraryBook, setLibraryBook] = useState<LibraryWithBook | null>(null);
  const { connectedUserFid } = useWarpcastConnection();
  const { getSecureValue } = useSecureStorage();
  const { libraryState, fetchLibraryData, addToLibrary } = useLibrary();
  const { userState } = useUser();
  const isFocused = useIsFocused();
  const { setToastMessage, hideToastMessage } = useToast();

  useEffect(() => {  
    const fullList = [...libraryState.tbr, ...libraryState.inProgress, ...libraryState.completed];
    const foundBook = fullList.find((l: LibraryWithBook) => l.books.title_author_key === `${book.title}-${book.author}`);    
    if (foundBook) {
      setLibraryBook(foundBook)
    } else {
      setLibraryBook(null);
    }
  }, [isFocused, libraryState])

  const fetchAndUpdate = async () => {
    await fetchLibraryData();
  }

  const removeFromLibrary = async () => {
    if(!userState.fid) {
      setToastMessage("info", "You need to be signed in to do this")
      return;
    }
    const signerUUID = await getSecureValue(StorageKeys.SIGNING_KEY)
    try {
      await fetch(`${apiUrl}/books/library/${libraryBook?.id}`, {
        method: "DELETE", 
        headers: {
          'Authorization': `Bearer ${signerUUID}`
        }
      });
      setToastMessage("success", "Removed book from library.");
      await fetchAndUpdate();
    } catch (error) {
      console.log("Remove from library error");
      console.log(error);
    }
  }

  const setNewStatus = (newStatus: string) => {
    setStatus(newStatus)
    setModalVisible(true);
  }

  const renderLibraryAction = () => {
    if (libraryBook && (libraryBook.status === "tbr" || libraryBook.status === null)) {
      return (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View className="flex flex-row items-center">
            <Foundation name="book-bookmark" size={24} color="#EAF4F4" />
            <Text style={{ fontFamily: "Metropolis-Bold" }} className="mx-2 text-lg font-bold text-light">Mark started</Text>
          </View>
        </TouchableOpacity>
      )
    } else if (libraryBook && libraryBook.status === "in-progress") {
      return (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View className="flex flex-row items-center">
            <Foundation name="book-bookmark" size={24} color="#EAF4F4" />
            <Text style={{ fontFamily: "Metropolis-Bold" }} className="mx-2 text-lg font-bold text-light">Mark completed</Text>
          </View>
        </TouchableOpacity>
      )
    } else if (libraryBook && libraryBook.status === "completed") {
      return (
        <TouchableOpacity>
          <View className="flex flex-row items-center">
            <Foundation name="book-bookmark" size={24} color="#EAF4F4" />
            <Text style={{ fontFamily: "Metropolis-Bold" }} className="mx-2 text-lg font-bold text-light">Completed</Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity onPress={() => addToLibrary(book, { status: "tbr" })}>
        <View className="flex flex-row items-center">
          <Foundation name="book-bookmark" size={24} color="#EAF4F4" />
          <Text style={{ fontFamily: "Metropolis-Bold" }} className="mx-2 text-lg font-bold text-light">Want to read</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={{ uri: book.thumbnail }}
      blurRadius={2}
      className="h-full"
    >
      <View className="h-full flex flex-col justify-between">
        <View className="flex flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
            <View className="flex flex-row items-center bg-dark rounded-full p-2 h-10 w-10">
              <FontAwesome name="chevron-left" size={24} color="#EAF4F4" />
            </View>
          </TouchableOpacity>
          <Menu style={{ borderRadius: 10 }}>
            <MenuTrigger>
              <View className="mr-2 flex flex-row items-center bg-dark rounded-full p-2 h-10 w-10">
                <Entypo name="dots-three-horizontal" size={24} color="#EAF4F4" />
              </View>
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  backgroundColor: '#272828',
                  padding: 5,
                  borderRadius: 5
                },
                optionsWrapper: {
                  backgroundColor: '#272828',
                },
                optionText: {
                  color: '#EAF4F4',
                },
              }}
            >
              <MenuOption onSelect={() => alert(`Share`)}>
                <View className="flex flex-row items-center">
                  <MaterialIcons name="ios-share" size={16} color="#EAF4F4" />
                  <Text className="ml-2 text-light font-sm" style={{ fontFamily: "Metropolis-Regular" }}>Share</Text>
                </View>
                {libraryBook && <View className="border-b border-b-lightest py-1"></View>}                
              </MenuOption>
              <MenuOption onSelect={() => setCorrectionModalVisible(true)}>
                <View className="flex flex-row items-center">
                  <Feather name="alert-circle" size={16} color="#EAF4F4" />
                  <Text className="ml-2 text-light font-sm" style={{ fontFamily: "Metropolis-Regular" }}>Submit correction</Text>
                </View>
                {libraryBook && <View className="border-b border-b-lightest py-1"></View>}                
              </MenuOption>
              {
                libraryBook &&
                <MenuOption onSelect={removeFromLibrary} >
                  <View className="flex flex-row items-center">
                    <MaterialIcons name="delete" size={16} color="#EAF4F4" />
                    <Text className="ml-2 text-light font-sm" style={{ fontFamily: "Metropolis-Regular" }}>Remove from library</Text>
                  </View>
                </MenuOption>
              }
            </MenuOptions>
          </Menu>
        </View>
        <View className="mx-auto justify-end relative">
          <Image
            className="w-52 h-60 mx-auto justify-end"
            source={{
              uri: book.thumbnail
            }}
          />
        </View>
        <View className="absolute -bottom-4 w-[95%] left-[2.5%] m-auto">
          <View className="flex w-full flex-row bg-accent py-4 px-6 rounded-md m-auto justify-center">
            {/* {renderLibraryAction()} */}
            <LibraryAction book={book} setNewStatus={setNewStatus} libraryBook={libraryBook} />
            <Text className="text-light mx-4 text-2xl" style={{ fontFamily: "Metropolis-Light" }}>|</Text>
            <TouchableOpacity onPress={userState?.fid ? () => navigation.navigate("Review", { book, libraryBook }) : () => navigation.navigate("Auth")}>
              <View className="flex flex-row items-center">
                <AntDesign name="staro" size={24} color="#EAF4F4" />
                <Text style={{ fontFamily: "Metropolis-Bold" }} className="mx-2 text-lg font-bold text-light">Add review</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Library Modal */}
      <LibraryModal newStatus={newStatus} fetchAndUpdate={fetchAndUpdate} book={book} userState={userState} libraryBook={libraryBook} setModalVisible={setModalVisible} modalVisible={modalVisible} />
      {/* Submit correction modal */}
      <CorrectionsModal book={book} userState={userState} setCorrectionModalVisible={setCorrectionModalVisible} correctionModalVisible={correctionModalVisible} />
    </ImageBackground>
  )
}

export default BookHeader