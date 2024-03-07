import React, { ReactComponentElement } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { FontAwesome5, Fontisto, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { FONTS } from 'constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';

type LibrarySelectorStateProps = {
  handleSelectSection: (selection: string) => void;
  selectedTab: string;
}

type CategoryOptions = {
  name: string;
  icon: any;
}

const LibrarySelectorState = ({ handleSelectSection, selectedTab }: LibrarySelectorStateProps) => {
  const options = [{
    name: "all",
    icon: <FontAwesome5 name="fire" size={28} color={selectedTab === "trending" ? "#181A1A" : "#EAF4F4"} />
  }, {
    name: "tbr",
    icon: <MaterialCommunityIcons name="sprout" size={28} color={selectedTab === "newest" ? "#181A1A" : "#EAF4F4"} />
  }, {
    name: "in-progress",
    icon: <FontAwesome5 name="bookmark" size={28} color={selectedTab === "fiction" ? "#181A1A" : "#EAF4F4"} />
  },
  {
    name: "completed",
    icon: <Fontisto name="person" size={28} color={selectedTab === "sci-fi" ? "#181A1A" : "#EAF4F4"} />
  }]

  const CategoryOption = ({ selection, icon }: { selection: string, icon: any }) => {
    const capitalized =
      selection.charAt(0).toUpperCase()
      + selection.slice(1)
    return (
      <TouchableOpacity className="mx-1" onPress={() => handleSelectSection(selection)}>
        {
          selectedTab === selection ? 
          <LinearGradient
          colors={['#CEFF41', '#EEFFBC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className={`min-w-[80px] flex flex-row items-center justify-center rounded-md border border-dark p-2`}>
          <Text>{capitalized === "Tbr" ? "To read" : capitalized}</Text>
        </LinearGradient> :
        <View className={`min-w-[80px] flex flex-row items-center justify-center rounded-md border border-dark p-2`}>
          <Text>{capitalized === "Tbr" ? "To read" : capitalized}</Text>
        </View>
        }              
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {options.map((c: CategoryOptions) => {
          return (
            <CategoryOption key={c.name} selection={c.name} icon={c.icon} />
          )
        })}
      </ScrollView>
    </View>
  )
}

export default LibrarySelectorState