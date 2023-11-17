import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

interface Note {
  text: string;
  time: string;
}

function NoteScreen() {
  const [noteText, setNoteText] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Загрузка заметок при запуске приложения
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes !== null) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Error loading notes", error);
    }
  };

  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    } catch (error) {
      console.error("Error saving notes", error);
    }
  };

  const handleAddNote = () => {
    if (noteText.trim() !== "") {
      const newNote: Note = {
        text: noteText,
        time: moment().format("HH:mm:ss"),
      };

      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setNoteText("");
    }
  };

  const handleLongPress = (index: number) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 8 }}
        placeholder="Введите заметку"
        value={noteText}
        onChangeText={(text) => setNoteText(text)}
      />
      <Button title="Запомнить заметку" onPress={handleAddNote} />

      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onLongPress={() => handleLongPress(index)}
            style={{ marginTop: 10, borderWidth: 1, padding: 8 }}
          >
            <Text>{item.text}</Text>
            <Text>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default NoteScreen;
