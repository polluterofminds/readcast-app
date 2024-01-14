import React, { useEffect, useState } from 'react'
import { ImageBackground, TouchableOpacity, View, Image, Text, Modal, ScrollView } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import { Book } from 'types';
import { NavigationProp, ParamListBase, useIsFocused } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from '@expo/vector-icons';
import useWarpcastConnection from 'hooks/useWarpcast';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
//  @ts-ignore
import { REACT_APP_API_URL } from "@env";
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

// const { ContextMenu, SlideInMenu, Popover } = renderers;


interface BookHeaderProps {
  book: Book;
  navigation: NavigationProp<ParamListBase>;
  library?: LibraryWithBook;
}

const BookHeader = ({ book, navigation }: BookHeaderProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  // const [renderer, setRenderer] = useState(ContextMenu);
  const [bookFormat, setBookFormat] = useState("paperback");
  const [dateCompleted, setDateCompleted] = useState<any>(dayjs());
  const [libraryBook, setLibraryBook] = useState<LibraryWithBook | null>(null);
  const { connectedUserFid } = useWarpcastConnection();
  const { getSecureValue } = useSecureStorage();
  const { libraryState, fetchLibraryData } = useLibrary();
  const { userState } = useUser();
  const isFocused = useIsFocused();
  const { setToastMessage, hideToastMessage } = useToast();

  useEffect(() => {
    const fullList = [...libraryState.tbr, ...libraryState.inProgress, ...libraryState.completed];
    const foundBook = fullList.find((l: LibraryWithBook) => l.book_id === book.id);
    if (foundBook) {
      setLibraryBook(foundBook)
      setBookFormat(foundBook.book_type || "paperback");
    } else {
      setLibraryBook(null);
    }
  }, [isFocused, libraryState])

  const fetchAndUpdate = async () => {
    await fetchLibraryData();
  }

  const addToLibrary = async () => {
    const signerUUID = await getSecureValue(StorageKeys.SIGNING_KEY)
    setToastMessage("info", "Adding to library...");
    try {
      await fetch(`${REACT_APP_API_URL}/books/library`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${signerUUID}`
        },
        body: JSON.stringify({
          book,
          fid: connectedUserFid,
          details: {
            status: "tbr"
          }
        })
      })
      await fetchAndUpdate()
    } catch (error) {
      console.log("Add to library error");
      console.log(error);
    }
  }

  const updateLibraryStatus = async (newStatus: string) => {
    const signerUUID = await getSecureValue(StorageKeys.SIGNING_KEY)
    setModalVisible(false);
    setToastMessage("info", "Updating library...");
    try {
      await fetch(`${REACT_APP_API_URL}/books/library/${libraryBook?.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${signerUUID}`
        },
        body: JSON.stringify({
          book,
          fid: connectedUserFid,
          details: {
            status: newStatus,
            bookFormat,
            dateCompleted
          }
        })
      })
      setToastMessage("success", "Updated!");
      await fetchAndUpdate();
    } catch (error) {
      console.log("Update library error")
      console.log(error);
    }
  }

  const removeFromLibrary = async () => {
    const signerUUID = await getSecureValue(StorageKeys.SIGNING_KEY)
    try {
      await fetch(`${REACT_APP_API_URL}/books/library/${libraryBook?.id}`, {
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

  const renderLibraryAction = () => {
    if (libraryBook && libraryBook.status === "tbr") {
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
      <TouchableOpacity onPress={() => addToLibrary()}>
        <View className="flex flex-row items-center">
          <Foundation name="book-bookmark" size={24} color="#EAF4F4" />
          <Text style={{ fontFamily: "Metropolis-Bold" }} className="mx-2 text-lg font-bold text-light">Want to read</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const options = [{
    text: "Paperback",
    onClick: () => setBookFormat("paperback"),
    isSelected: bookFormat === "paperback"
  },
  {
    text: "Hardcover",
    onClick: () => setBookFormat("hardcover"),
    isSelected: bookFormat === "hardcover"
  },
  {
    text: "Ebook",
    onClick: () => setBookFormat("ebook"),
    isSelected: bookFormat === "ebook"
  }, {
    text: "Audio",
    onClick: () => setBookFormat("audio"),
    isSelected: bookFormat === "audio"
  }]

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
            {renderLibraryAction()}
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
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        presentationStyle='pageSheet'
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View className="bg-dark p-6 h-screen flex justify-center items-center">
          <ScrollView>
            <Text className="text-2xl text-light" style={{ fontFamily: "Metropolis-Bold" }}>What format {libraryBook && libraryBook.status === "tbr" ? "are you reading this book in?" : "did you read this book in?"}</Text>
            {
              options.map((o: any) => {
                return (
                  <TouchableOpacity onPress={o.onClick} key={o.text}>
                    <View className="mt-2 flex flex-row items-center">
                      <View className={o.isSelected ? "h-8 w-8 rounded-sm bg-primary" : "h-8 w-8 rounded-sm border border-primary"}></View>
                      <Text className="ml-2 text-lg text-light" style={{ fontFamily: "Metropolis-Regular" }}>{o.text}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })
            }
            {
              libraryBook && libraryBook.status === "in-progress" &&
              <View className="mt-4 pb-6">
                <Text className="ml-2 text-lg text-light" style={{ fontFamily: "Metropolis-Bold" }}>Date finished</Text>
                <View className="mt-2 bg-lightest text-dark rounded-md">
                  <DateTimePicker
                    value={dateCompleted}
                    onValueChange={(d) => setDateCompleted(d)}
                  />
                </View>
              </View>
            }
            <View className="flex flex-row justify-end mt-6">
              <View className="flex flex-row items-center">
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text className="mr-2 text-lightest text-lg" style={{ fontFamily: "Metropolis-Bold" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateLibraryStatus(libraryBook && libraryBook.status === "tbr" ? "in-progress" : "completed")}>
                  <Text className="text-dark bg-primary w-30 px-2 py-1 text-lg" style={{ fontFamily: "Metropolis-Bold" }}>{libraryBook && libraryBook.status === "tbr" ? "Mark as started" : "Mark as completed"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ImageBackground>
  )
}

export default BookHeader