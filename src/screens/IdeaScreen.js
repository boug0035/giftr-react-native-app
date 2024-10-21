import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import useGiftContext from "../hooks/useGiftContext";
import ErrorModal from "../components/ErrorModal";

const IdeaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params;
  const { getPersonIdeas, deleteIdea, people, error, clearError } =
    useGiftContext();
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const person = people.find((p) => p.id === personId);
    if (person) {
      navigation.setOptions({ title: `${person.name}'s Gift Ideas` });
      setIdeas(getPersonIdeas(personId));
    }
  }, [personId, people]);

  const handleDeleteIdea = async (ideaId) => {
    await deleteIdea(personId, ideaId);
    setIdeas(getPersonIdeas(personId));
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.img }} style={styles.thumbnail} />
      <Text style={styles.ideaText}>{item.text}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteIdea(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color="#FF5A5F" />
      </TouchableOpacity>
    </View>
  );

  const renderAddButton = () => {
    if (Platform.OS === "android") {
      return (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddIdea", { personId })}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      );
    } else {
      return null; // For iOS, we'll add the button in the navigation header
    }
  };

  React.useLayoutEffect(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("AddIdea", { personId })}
            style={styles.headerButton}
          >
            <Ionicons name="add" size={24} color="#008489" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, personId]);

  return (
    <View style={styles.container}>
      {ideas.length === 0 ? (
        <Text style={styles.emptyMessage}>No gift ideas yet. Add one!</Text>
      ) : (
        <FlatList
          data={ideas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      {renderAddButton()}
      <ErrorModal visible={!!error} message={error} onClose={clearError} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  listContent: {
    padding: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
  },
  ideaText: {
    flex: 1,
    fontSize: 16,
    color: "#484848",
  },
  deleteButton: {
    padding: 8,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#484848",
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#008489",
    borderRadius: 28,
    elevation: 8,
  },
  headerButton: {
    marginRight: 16,
  },
});

export default IdeaScreen;
