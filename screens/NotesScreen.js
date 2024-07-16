import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Pressable, Modal, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, query, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { useFocusEffect } from '@react-navigation/native';

export const NotesScreen = ({ navigation }) => {
    const [note, setNote] = useState('');
    const [edita, setEdita] = useState('');
    const [notes, setNotes] = useState([]);
    const [id, setId] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
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

    const handleDelete = async (id, deleta) => {
        try {
            setModalVisible(!modalVisible)
            if(deleta){
                await deleteDoc(doc(db, "notes", id));
                buscaNotas()
            }
            
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
                    alert('Nota editada com sucesso!')
                    buscaNotas();
                } else {
                    await addDoc(collection(db, "notes"), {
                        text: note,
                        userID: 'xxxx'
                    });
                    setNote('');
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
            <TouchableOpacity
                style={{
                    width: '100%',
                    padding: 10,
                    borderColor: 'red',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "#FF8096"
                }}
                onPress={addNote}
            >
                <Text style={{ color: '#fff'}}>ADD NOTE</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    alert('A caixa de diálogo foi encerrada');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Deseja realmente deletar este registro?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => handleDelete(id, true)}>
                                <Text style={styles.textStyle}>Sim</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Não</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={notes}
                keyExtractor={item => item.id}
                extraData={notes}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => handleEdit(item.id, item.text)}
                        onLongPress={() => {
                            setId(item.id)
                            setModalVisible(true)
                        }}
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: "#FF8096",
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default NotesScreen;
