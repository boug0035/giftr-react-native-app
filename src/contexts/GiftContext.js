import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";

const GiftContext = createContext();

export const GiftProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPeopleFromStorage();
  }, []);

  const loadPeopleFromStorage = async () => {
    try {
      const storedPeople = await AsyncStorage.getItem("people");
      if (storedPeople) {
        setPeople(JSON.parse(storedPeople));
      }
    } catch (error) {
      setError("Error loading people from storage");
    }
  };

  const savePeopleToStorage = async (updatedPeople) => {
    try {
      await AsyncStorage.setItem("people", JSON.stringify(updatedPeople));
    } catch (error) {
      setError("Error saving people to storage");
    }
  };

  const addPerson = async (name, dob) => {
    if (!name || !dob) {
      setError("Name and date of birth are required");
      return null;
    }
    const newPerson = {
      id: Crypto.randomUUID(),
      name,
      dob,
      ideas: [],
    };
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    await savePeopleToStorage(updatedPeople);
    return newPerson;
  };

  const deletePerson = async (personId) => {
    const updatedPeople = people.filter((person) => person.id !== personId);
    setPeople(updatedPeople);
    await savePeopleToStorage(updatedPeople);
  };

  const getPersonIdeas = (personId) => {
    const person = people.find((p) => p.id === personId);
    return person ? person.ideas : [];
  };

  const addIdea = async (personId, text, img, width, height) => {
    if (!text || !img) {
      setError("Text and image are required for an idea");
      return;
    }
    try {
      const fileName = img.split("/").pop();
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.moveAsync({
        from: img,
        to: newPath,
      });

      const updatedPeople = people.map((person) => {
        if (person.id === personId) {
          const newIdea = {
            id: Crypto.randomUUID(),
            text,
            img: newPath,
            width,
            height,
          };
          return { ...person, ideas: [...person.ideas, newIdea] };
        }
        return person;
      });
      setPeople(updatedPeople);
      await savePeopleToStorage(updatedPeople);
    } catch (error) {
      setError("Error adding idea");
    }
  };

  const deleteIdea = async (personId, ideaId) => {
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        const ideaToDelete = person.ideas.find((idea) => idea.id === ideaId);
        if (ideaToDelete) {
          FileSystem.deleteAsync(ideaToDelete.img).catch((err) =>
            console.error("Error deleting image:", err)
          );
        }
        return {
          ...person,
          ideas: person.ideas.filter((idea) => idea.id !== ideaId),
        };
      }
      return person;
    });
    setPeople(updatedPeople);
    await savePeopleToStorage(updatedPeople);
  };

  const getSortedPeople = () => {
    return [...people].sort((a, b) => {
      const dateA = new Date(a.dob);
      const dateB = new Date(b.dob);
      if (dateA.getMonth() !== dateB.getMonth()) {
        return dateA.getMonth() - dateB.getMonth();
      }
      return dateA.getDate() - dateB.getDate();
    });
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    people,
    addPerson,
    deletePerson,
    getPersonIdeas,
    addIdea,
    deleteIdea,
    getSortedPeople,
    error,
    clearError,
  };

  return <GiftContext.Provider value={value}>{children}</GiftContext.Provider>;
};

export default GiftContext;
