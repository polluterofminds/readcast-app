import useDebounce from 'hooks/debounce';
import React, { useEffect, useState } from 'react'
import { TextInput, View } from 'react-native'
import { REACT_APP_API_URL } from "@env"
import { Book } from 'types';
import Results from './Results';
import RecentSearches from './RecentSearches';
import useError from 'hooks/useError';

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);
  const [emptyState, setEmptyState] = useState(false);

  const debouncedValue = useDebounce(searchText, 1000);
  const { submitError } = useError();

  useEffect(() => {
    if(debouncedValue) {
      handleSearch();
    }    
  }, [debouncedValue])

  const handleChange = (value: string) => {
    setEmptyState(false);
    setSearching(true);
    setSearchText(value)
  }

  const handleSearch = async () => {
    try {
      setEmptyState(false);
      setSearching(true);
      const res = await fetch(`${REACT_APP_API_URL}/books/search?title=${debouncedValue}`)
      const data = await res.json();
      if(data.length === 0) {
        setEmptyState(true);
      }
      setResults(data);
      setSearching(false); 
    } catch (error) {
      console.log(error);
      submitError(error);
      setSearching(false);
    }
  }
  return (
    <View className="min-h-screen bg-dark p-4">
      <TextInput 
        placeholderTextColor={'#dfebeb'}
        autoFocus
        autoComplete='off'
        style={{ fontFamily: "Metropolis-Regular"}}
        className="mt-6 w-full border border-primary h-16 rounded-md px-2 text-light"       
        onChangeText={handleChange}
        value={searchText}
        placeholder='Search'
      />
      {
        searchText.length > 0 ? 
        <Results submitError={submitError} results={results} emptyState={emptyState} /> : 
        <RecentSearches />
      }
    </View>
  )
}

export default Search