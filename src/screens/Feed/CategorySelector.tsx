import React, { ReactComponentElement } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { FontAwesome5, Fontisto, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

type CategorySelectorProps = {
  handleSelectSection: (selection: string) => void;
  selectedTab: string;
}

type CategoryOptions = {
  name: string;
  icon: any;
}

const CategorySelector = ({ handleSelectSection, selectedTab }: CategorySelectorProps) => {
  const categories = [{
    name: "trending", 
    icon: <FontAwesome5 name="fire" size={28} color={selectedTab === "trending" ? "#181A1A" : "#EAF4F4"} />
  }, {
    name: "newest", 
    icon: <MaterialCommunityIcons name="sprout" size={28} color={selectedTab === "newest" ? "#181A1A" : "#EAF4F4"} />
  }, {
    name: "fiction", 
    icon: <FontAwesome5 name="bookmark" size={28} color={selectedTab === "fiction" ? "#181A1A" : "#EAF4F4"} />
  },
  {
    name: "biography", 
    icon: <Fontisto name="person" size={28} color={selectedTab === "sci-fi" ? "#181A1A" : "#EAF4F4"} />
  }, 
  {
    name: "business", 
    icon: <FontAwesome name="briefcase" size={28} color={selectedTab === "sci-fi" ? "#181A1A" : "#EAF4F4"} />
  }]

  const CategoryOption = ({ selection, icon }: { selection: string, icon: any }) => {    
    return (
      <TouchableOpacity className="mx-2" onPress={() => handleSelectSection(selection)}>
        <View className={`flex flex-row items-center justify-center w-20 h-20 rounded-full ${selectedTab === selection ? "bg-primary" : "border border-primary"}`}>
          {icon}
        </View>
        <Text className="text-center mt-1 text-light" style={{fontFamily: "Metropolis-Light"}}>{selection.toUpperCase()}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {categories.map((c: CategoryOptions) => {
          return (
            <CategoryOption selection={c.name} icon={c.icon} />
          )
        })}
      </ScrollView>
    </View>
  )
}

export default CategorySelector