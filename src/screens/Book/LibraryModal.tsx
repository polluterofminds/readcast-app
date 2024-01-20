import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, Text, Modal, ScrollView } from 'react-native'
import { Book, LibraryWithBook } from 'types';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import useToast from 'hooks/useToast';
import { UserState } from 'contexts/UserContext';
import useSecureStorage from 'hooks/useSecureStorage';
import { StorageKeys } from 'constants/storageKeys';
import Constants from 'expo-constants'
//  @ts-ignore
import { REACT_APP_API_URL } from "@env";

const apiUrl = Constants?.expoConfig?.hostUri
? `http://${Constants?.expoConfig?.hostUri?.split(`:`)?.shift()?.concat(`:3000`)}`
: REACT_APP_API_URL

interface LibraryModalProps {
  modalVisible: boolean;
  setModalVisible: Function;
  libraryBook?: LibraryWithBook | null;
  userState: UserState;
  book: Book;
  fetchAndUpdate: Function;
}

const LibraryModal = ({ modalVisible, setModalVisible, libraryBook, userState, book, fetchAndUpdate }:  LibraryModalProps) => {
  const [bookFormat, setBookFormat] = useState("paperback");
  const [dateCompleted, setDateCompleted] = useState<any>(dayjs());
  const { setToastMessage, hideToastMessage } = useToast();
  const { getSecureValue } = useSecureStorage();

  useEffect(() => {
    setBookFormat(libraryBook?.book_type || "paperback");
  }, [libraryBook]);

  const updateLibraryStatus = async (newStatus: string) => {
    if(!userState.fid) {
      setToastMessage("info", "You need to be signed in to do this")
      return;
    }
    const signerUUID = await getSecureValue(StorageKeys.SIGNING_KEY)
    setModalVisible(false);
    setToastMessage("info", "Updating library...");
    try {
      await fetch(`${apiUrl}/books/library/${libraryBook?.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${signerUUID}`
        },
        body: JSON.stringify({
          book,
          fid: userState.fid,
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
                  <View className={o.isSelected ? "h-8 w-8 rounded-lg bg-primary" : "h-8 w-8 rounded-lg border border-primary"}></View>
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
              <Text className="mr-4 text-lightest text-lg" style={{ fontFamily: "Metropolis-Bold" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updateLibraryStatus(libraryBook && libraryBook.status === "tbr" ? "in-progress" : "completed")}>
              <View className="bg-primary w-30 px-2 py-1 rounded-lg">
                <Text className="text-dark text-lg" style={{ fontFamily: "Metropolis-Bold" }}>{libraryBook && libraryBook.status === "tbr" ? "Mark as started" : "Mark as completed"}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  </Modal>
  )
}

export default LibraryModal