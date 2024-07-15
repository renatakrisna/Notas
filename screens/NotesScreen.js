import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Pressable } from 'react-native';
import { getFirestore, collection, getDocs, query, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { useFocusEffect } from '@react-navigation/native';

export const NotesScreen = ({ navigation }) => {
    const [note, setNote] = useState('');
    const [edita, setEdita] = useState('');
    const [notes, setNotes] = useState([]);
    const db = getFirestore();

    useFocusEffect(
        useCallback(() => {
            buscaNotas();
        }, [])
    );

    useEffect(() => {
        buscaNotas();
    }, []);

    const buscaNotas = async () => {
        const querySnapshot = await getDocs(query(collection(db, "notes")));
        let lista = [];
        querySnapshot.forEach((doc) => {
            const resultado = JSON.parse(JSON.stringify(doc.data()));
            const newNote = {
                id: doc.id,
                text: resultado.text
            };
            lista.push(newNote);
        });
        setNotes(lista);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "notes", id));
            buscaNotas()
        } catch (error) {
            alert(error)
        }
    }

    const handleEdit = async (id, textoAtual) => {
        setNote(textoAtual)
        setEdita(id)
    }

    const addNote = async () => {
        if (note.trim()) {
            try {
                if (edita) {
                    await setDoc(doc(db, "notes", edita), {
                        text: note,
                    });
                    setEdita('')
                    setNote('');
                    buscaNotas();
                } else {
                    await addDoc(collection(db, "notes"), {
                        text: note,
                        userID: 'xxxx'
                    });
                    setNote('');
                    alert('Note created successfully');
                    buscaNotas();
                }
            } catch (error) {
                alert(error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="New Note"
                value={note}
                onChangeText={setNote}
                style={styles.input}
            />
            <Button 
            title="Add Note" 
            onPress={addNote}
            color="#FF8096" />

            <FlatList
                data={notes}
                keyExtractor={item => item.id}
                extraData={notes}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => handleEdit(item.id, item.text)}
                        onLongPress={() => handleDelete(item.id)}
                    >
                        <View style={styles.note} >
                            <Text>{item.text}</Text>
                        </View>
                    </Pressable>

                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 25
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    note: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
});

export default NotesScreen;
