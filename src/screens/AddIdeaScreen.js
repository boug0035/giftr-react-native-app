import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import useGiftContext from "../hooks/useGiftContext";
import ErrorModal from "../components/ErrorModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ASPECT_RATIO = 2 / 3;
const IMAGE_WIDTH = SCREEN_WIDTH * 0.6;
const IMAGE_HEIGHT = IMAGE_WIDTH * ASPECT_RATIO;

const AddIdeaScreen = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params;
  const { addIdea, error, clearError, setError } = useGiftContext();

  const takePicture = async () => {
    if (cameraRef.current) {
      const sizes = await cameraRef.current.getAvailablePictureSizesAsync(
        "2:3"
      );
      const optimalSize = sizes[Math.floor(sizes.length / 2)];
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
        ratio: "2:3",
        pictureSize: optimalSize,
      });
      setImage(photo.uri);
    }
  };

  const handleSave = async () => {
    if (text && image) {
      await addIdea(personId, text, image, IMAGE_WIDTH, IMAGE_HEIGHT);
      navigation.navigate("Ideas", { personId });
    } else {
      clearError();
      setError("Both text and image are required");
    }
  };

  const handleCancel = () => {
    navigation.navigate("Ideas", { personId });
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.cameraContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
        )}
      </View>
      <View style={styles.controls}>
        {!image && (
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Enter gift idea"
        />
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
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  cameraContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    alignSelf: "center",
    marginTop: 20,
    overflow: "hidden",
    borderRadius: 8,
  },
  camera: {
    flex: 1,
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  controls: {
    flex: 1,
    padding: 20,
  },
  captureButton: {
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#008489",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#008489",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#ffffff",
  },
});

export default AddIdeaScreen;
