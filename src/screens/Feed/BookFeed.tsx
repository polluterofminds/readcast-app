import React from 'react'
import { FlatList, View } from 'react-native'
import { Book } from 'types'
import BookFeedItem from './BookFeedItem'

interface BookFeedProps {
  books: Book[]
}

const BookFeed = ({ books }: BookFeedProps) => {
  return (
    <FlatList
      data={books.filter((b: Book) => b.description && b.thumbnail)}
      renderItem={({ item }) => (
        <BookFeedItem book={item} />
      )}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={{ paddingBottom: 250, margin: "auto" }}
    />
  )
}

export default BookFeed