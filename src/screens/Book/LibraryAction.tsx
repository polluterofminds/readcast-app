import React from 'react'
import { Text, View } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  // renderers
} from 'react-native-popup-menu';
import { Book, LibraryWithBook } from 'types';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLibrary } from 'hooks/useLibrary';

interface LibraryActionProps {
  libraryBook: LibraryWithBook | null;
  setNewStatus: Function;
  book: Book;
}

const LibraryAction = ({ libraryBook, book, setNewStatus }: LibraryActionProps) => {
  const { updateLibraryStatus, addToLibrary } = useLibrary();

  const setToBeRead = async () => {
    if(!libraryBook) {
      await addToLibrary(book, {
        status: "tbr"
      })
    }
    await updateLibraryStatus("tbr", libraryBook, book, {
      status: "tbr",
    })
  }
  return (
    <Menu style={{ borderRadius: 10 }}>
      <MenuTrigger>

        <Text style={{ fontFamily: "Metropolis-Bold" }} className="mx-2 text-lg font-bold text-light">{libraryBook ? "Update status" : "Add to library"}</Text>

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
        <MenuOption onSelect={() => setToBeRead()}>
          <View className="flex flex-row items-center">
            <FontAwesome5 name="bookmark" size={18} color={"#EAF4F4"} />
            <Text className="ml-2 text-light font-sm" style={{ fontFamily: "Metropolis-Regular" }}>Want to read</Text>
          </View>
          {libraryBook && <View className="border-b border-b-lightest py-1"></View>}
        </MenuOption>
        <MenuOption onSelect={() => setNewStatus("in-progress")}>
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="book" size={18} color={"#EAF4F4"} />
            <Text className="ml-2 text-light font-sm" style={{ fontFamily: "Metropolis-Regular" }}>Mark as in-progress</Text>
          </View>
          {libraryBook && <View className="border-b border-b-lightest py-1"></View>}
        </MenuOption>
          <MenuOption onSelect={() => setNewStatus("completed")} >
            <View className="flex flex-row items-center">
              <FontAwesome5 name="check" size={18} color={"#EAF4F4"} />
              <Text className="ml-2 text-light font-sm" style={{ fontFamily: "Metropolis-Regular" }}>Mark as complete</Text>
            </View>
          </MenuOption>
      </MenuOptions>
    </Menu>
  )
}

export default LibraryAction