import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { Book } from 'types'
import ResultItem from './ResultItem'
import { Entypo } from '@expo/vector-icons';

interface ResultsProps {
  results: Book[];
  emptyState: boolean;
  submitError: Function;
}

const Results = ({ results, emptyState, submitError }: ResultsProps) => {
  return (
    <View className="mt-4 pb-64">
      <Text className="text-light font-bold text-xl mb-4" style={{fontFamily: "Metropolis-Bold"}}>Search results</Text>
      {
        emptyState ?
        <View className="pt-6 w-3/4 m-auto flex flex-col justify-center align-center items-center">
          <Entypo name="open-book" size={28} color="#EAF4F4" />
          <Text className="text-light text-lg text-center" style={{fontFamily: "Metropolis-Bold"}}>No books found, try another search.</Text>
        </View> : 
        <FlatList
        data={results}
        renderItem={({ item }) => (
          <ResultItem submitError={submitError} book={item} />
        )}
        keyExtractor={item => item.id}
        numColumns={1}
        contentContainerStyle={{ paddingBottom: 250, margin: "auto" }}
      />
      }      
    </View>
  )
}

export default Results