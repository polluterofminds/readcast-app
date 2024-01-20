import { UserState } from 'contexts/UserContext';
import useToast from 'hooks/useToast';
import React, { useState } from 'react'
import { TouchableOpacity, View, Text, Modal, ScrollView, TextInput } from 'react-native'
import { Book } from 'types';
import Constants from 'expo-constants'
//  @ts-ignore
import { REACT_APP_API_URL } from "@env";

const apiUrl = Constants?.expoConfig?.hostUri
? `http://${Constants?.expoConfig?.hostUri?.split(`:`)?.shift()?.concat(`:3000`)}`
: REACT_APP_API_URL

interface CorrectionsModalProps {
  setCorrectionModalVisible: Function;
  correctionModalVisible: boolean;
  userState: UserState;
  book: Book;
}

const CorrectionsModal = ({ setCorrectionModalVisible, correctionModalVisible, userState, book }: CorrectionsModalProps) => {
  const [corrections, setCorrections] = useState<string[]>([]);
  const [correctionText, setCorrectionText] = useState("");
  const { setToastMessage, hideToastMessage } = useToast();

  const updateCorrections = (type: string) => {    
    const currentCorrections = JSON.parse(JSON.stringify(corrections));
    if(currentCorrections.includes(type)) {
      setCorrections(currentCorrections.filter((c: string) => c !== type));
    } else {
      currentCorrections.push(type)
      setCorrections(currentCorrections)
    } 
  }

  const submitCorrection = async () => {
    try {
      if(!userState.fid) {
        setToastMessage("info", "You need to be signed in to do this")
        return;
      }

      const correctionDetails = {
        book_id: book.id,
        corrections,
        correction_text: correctionText, 
        fid: userState.fid
      }
      const res = await fetch(`${apiUrl}/books/correction`, {
        method: "POST", 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(correctionDetails)
      })
      if(!res.ok) {
        throw new Error("Trouble submitting review")
      }
      setCorrectionModalVisible(false);
      setToastMessage("success", "Thank you! Your submission will be reviewed.")
      setCorrectionText("");
      setCorrections([]);
    } catch (error) {
      console.log(error);
      setCorrectionModalVisible(false);
      setToastMessage("error", "Trouble submitting correction")
    }
  }

  const correctionOptions = [{
    text: "Title",
    onClick: () => updateCorrections("title"),
    isSelected: corrections.includes("title")
  },
  {
    text: "Author",
    onClick: () => updateCorrections("author"),
    isSelected: corrections.includes("author")
  },
  {
    text: "Image",
    onClick: () => updateCorrections("image"),
    isSelected: corrections.includes("image")
  }, {
    text: "Description",
    onClick: () => updateCorrections("description"),
    isSelected: corrections.includes("description")
  }]
  return (
    <Modal
    animationType="slide"
    transparent={false}
    visible={correctionModalVisible}
    presentationStyle='pageSheet'
    onRequestClose={() => {
      setCorrectionModalVisible(!correctionModalVisible);
    }}>
    <View className="bg-dark p-6 h-screen flex justify-center items-center">
      <ScrollView>            
        <Text className="text-2xl text-light" style={{ fontFamily: "Metropolis-Bold" }}>What corrections need to be made?</Text>
        {
          correctionOptions.map((o: any) => {
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
        <View className="mt-4">
          <TextInput onChangeText={(text: string) => setCorrectionText(text)} value={correctionText} placeholderTextColor="#dfebeb" className="h-28 text-light text-lg border border-light rounded-md p-4" multiline={true} maxLength={240} placeholder='Optionally include additional information' style={{ fontFamily: "Metropolis-Regular" }}></TextInput>
        </View>
        <View className="flex flex-row justify-end mt-6">
          <View className="flex flex-row items-center">
            <TouchableOpacity
              onPress={() => setCorrectionModalVisible(!correctionModalVisible)}>
              <Text className="mr-4 text-lightest text-lg" style={{ fontFamily: "Metropolis-Bold" }}>Cancel</Text>
            </TouchableOpacity>                
            <TouchableOpacity                  
              onPress={() => submitCorrection()}>
              <View className="bg-primary w-30 px-2 py-1 rounded-lg">
                <Text className="text-dark text-lg" style={{ fontFamily: "Metropolis-Bold" }}>Submit correction</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  </Modal>
  )
}

export default CorrectionsModal