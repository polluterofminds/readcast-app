import useDebounce from 'hooks/debounce';
import React, { useEffect, useState } from 'react'
import { TextInput, View, Text, TouchableOpacity } from 'react-native'
import { REACT_APP_API_URL } from "../../../config"
import { Book } from 'types';
import Results from './Results';
import RecentSearches from './RecentSearches';
import useError from 'hooks/useError';
import { MaterialIcons } from '@expo/vector-icons';
const apiUrl = REACT_APP_API_URL;

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);
  const [emptyState, setEmptyState] = useState(false);
  const [ellipsisState, setEllipsisState] = useState("")

  const debouncedValue = useDebounce(searchText, 1000);
  const { submitError } = useError();

  useEffect(() => {
    if (debouncedValue) {
      handleSearch();
    }
  }, [debouncedValue])

  const handleChange = (value: string) => {
    setEmptyState(false);
    setSearching(true);
    setSearchText(value)
  }

  const generateEllipsis = async () => {
    let count = 0;
    let ellipsis = ""
    if (count === 3) {
      count = 0;
      generateEllipsis();
    } else {
      while (count < 3) {
        ellipsis = ellipsis = "."
        setEllipsisState(ellipsis)
        count++;
      }
    }
  }

  const handleSearch = async () => {
    try {
      setResults([]);
      setEmptyState(false);
      setSearching(true);
      generateEllipsis();
      const res = await fetch(`${apiUrl}/books/search?terms=${debouncedValue}`)
      const data = await res.json();
      if (data.length === 0) {
        setEmptyState(true);
      }
      setResults(data);
      setSearching(false);
      setEllipsisState("");
    } catch (error) {
      console.log("Search error")
      console.log(error);
      submitError(error);
      setSearching(false);
      setEllipsisState("");
    }
  }
  return (
    <View className="min-h-screen bg-dark p-4">
      <View className="flex flex-row relative items-center">
        <TextInput
          placeholderTextColor={'#dfebeb'}
          autoFocus
          autoComplete='off'
          style={{ fontFamily: "Metropolis-Regular" }}
          className="mt-6 w-full border border-primary h-16 rounded-md px-2 text-light"
          onChangeText={handleChange}
          value={searchText}
          placeholder='Search'
        />
        {
          searchText.length > 0 &&
          <View className="absolute right-5 bottom-5">
          <TouchableOpacity onPress={() => setSearchText("")}>
            <MaterialIcons name="clear" size={24} color="#EAF4F4" />
          </TouchableOpacity>
        </View>   
        }            
      </View>
      {
        searchText.length > 0 && !searching ?
          <Results submitError={submitError} results={results} emptyState={emptyState} /> :
          searchText.length > 0 && searching ?
            <View className="mt-4">
              <Text className="text-lg text-light" style={{ fontFamily: "Metropolis-Regular" }}>Searching {ellipsisState}</Text>
            </View> :
            <RecentSearches />
      }
    </View>
  )
}

export default Search