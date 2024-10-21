import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { useNavigation } from "@react-navigation/native";
import useGiftContext from "../hooks/useGiftContext";
import ErrorModal from "../components/ErrorModal";

const AddPersonScreen = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const { addPerson, error, clearError, setError } = useGiftContext();

  const handleSave = async () => {
    if (name && dob) {
      const formattedDob = dob.replace(/\//g, "-"); // Convert YYYY/MM/DD to YYYY-MM-DD
      const newPerson = await addPerson(name, formattedDob);
      if (newPerson) {
        navigation.goBack();
      }
    } else {
      clearError();
      setError("Name and date of birth are required");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const formatDisplayDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("/");
    return `${month}/${day}/${year}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
        />
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {dob ? formatDisplayDate(dob) : "Select Date of Birth"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DatePicker
            onSelectedChange={(date) => {
              setDob(date);
              setShowDatePicker(false);
            }}
            mode="calendar"
            style={styles.datePicker}
            options={{
              defaultFont: "System",
              headerFont: "System",
            }}
          />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ErrorModal visible={!!error} message={error} onClose={clearError} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#484848",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#484848",
  },
  datePicker: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#008489",
    marginLeft: 8,
  },
  saveButtonText: {
    color: "#ffffff",
  },
});

export default AddPersonScreen;
