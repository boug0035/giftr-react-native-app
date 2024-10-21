import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import useGiftContext from "../hooks/useGiftContext";
import ErrorModal from "../components/ErrorModal";

const PeopleScreen = () => {
  const navigation = useNavigation();
  const { getSortedPeople, deletePerson, error, clearError } = useGiftContext();

  const renderRightActions = (progress, dragX, item) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const handleDelete = (personId) => {
    Alert.alert(
      "Delete Person",
      "Are you sure you want to delete this person?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(personId),
        },
      ]
    );
  };

  const confirmDelete = async (personId) => {
    await deletePerson(personId);
  };

  const renderItem = ({ item }) => {
    const dob = new Date(item.dob);
    const formattedDob = dob.toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
      >
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Ideas", { personId: item.id })}
        >
          <View style={styles.itemContent}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.dob}>{formattedDob}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#484848" />
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderAddButton = () => {
    if (Platform.OS === "android") {
      return (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddPerson")}
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
            onPress={() => navigation.navigate("AddPerson")}
            style={styles.headerButton}
          >
            <Ionicons name="add" size={24} color="#008489" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      {getSortedPeople().length === 0 ? (
        <Text style={styles.emptyMessage}>
          Add your first person to get started!
        </Text>
      ) : (
        <FlatList
          data={getSortedPeople()}
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  itemContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#484848",
    marginBottom: 4,
  },
  dob: {
    fontSize: 14,
    color: "#767676",
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
  deleteButton: {
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
});

export default PeopleScreen;
