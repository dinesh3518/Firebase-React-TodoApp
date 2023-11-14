import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { db } from '../firebase/firebase';
import { Dna } from 'react-loader-spinner'
import Modal from 'react-bootstrap/Modal'
import { Delete } from "@mui/icons-material";
import {
    collection,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore';
import { Link, useParams } from "react-router-dom";
import Cookies from 'universal-cookie';
import Todopopup from "./TodoPoupup";
import DashBoard from "./DashBoard";
const cookies = new Cookies();

export const Todo = () => {

    const [todoList, setTodolist] = useState([]);
    const [searchText, setsearchText] = useState('');
    const [search, setsearch] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    const todosRef = collection(db, `todos/${id}/todos`);
    // const todosRef=doc(todos,"dinesh");

    useEffect(() => {

        const queryMessages = query(todosRef, orderBy("order"));

        if (queryMessages === undefined) {
            console.log("query undefined");
            return;
        }
        const freeup = onSnapshot(queryMessages, (snapshot) => {
            console.log("snapshot data:", snapshot.docs.map((doc) => doc.data()));

            try {
                setTodolist(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            } catch (error) {
                console.error(error);
            }
        });

        setIsLoading(false);

        return freeup;
    }, []);

    const handleSearch = (e) => {
        const searchText = e.target.value.trimStart();
        setsearchText(searchText);

        // Filter the todoList based on searchText
        const filteredList = todoList.filter((item) =>
            item.description.toLowerCase().includes(searchText.toLowerCase())
        );

        // Update the search state
        setsearch(filteredList);
    };

    const searchItems = searchText ? search : todoList;

    const handleDelete = (id) => {
        deleteDoc(doc(todosRef, id));
    }

    const completed = (value) => {
        if (value.id) {
            try {
                console.log('try works')
                const updateRef = doc(todosRef, value.id);
                updateDoc(updateRef, { isDone: !value.isDone });
            } catch (error) {
                console.log(error);
            }
        }
    }

    const onDragEnd = (result) => {
        if (!result.destination) {
            return; // If the item was dropped outside of the list, do nothing
        }

        const items = Array.from(todoList);
        const [reorderedItem] = items.splice(result.source.index, 1); // Remove the dragged item
        items.splice(result.destination.index, 0, reorderedItem); // Insert the item at the new position
        setTodolist(items);

        items.forEach((item, index) => {
            updateDoc(doc(todosRef, item.id), { order: index + 1 });
        });
    };

    if (!cookies.get('auth-token')) {
        return <h3 className="d-flex justify-content-center align-items-center vh-100"><Link to={'/'}>Login </Link>{' '} to continue</h3>
    }
    return (
        <div className="min-vh-100 p-2">
            <DragDropContext onDragEnd={onDragEnd}>
                <div>
                    <DashBoard todosRef={todosRef} list={todoList}/>
                </div>

                <div className="container m-2 bg-light p-2 shadow-lg mb-3 rounded">
                    <div className="mb-2 d-flex  flex-column flex-md-row justify-content-between">

                        <p className="fw-bold m-2 text-center text-primary">Task List</p>
                        <div className="d-flex">
                        <input type="text" id="search" placeholder="Search by task name" value={searchText}
                                className="mr-2 m-1 w-60 form-control-sm"
                                onChange={handleSearch} />
                            <Todopopup val={''} todosRef={todosRef} />
                        </div>

                    </div>
                    {todoList.length ? (
                        <Droppable droppableId="todoList">
                            {(provided) => (
                                <Table striped bordered hover variant="">
                                    <tbody ref={provided.innerRef}>
                                        {searchItems.map((val, index) => (
                                            <Draggable key={val.id} draggableId={val.id} index={index}>
                                                {(provided) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <td className="text-center"> <input
                                                            type="checkbox"
                                                            id={val.id}
                                                            // value={val.id}
                                                            checked={val.isDone}
                                                            onChange={() => completed(val)}
                                                        />
                                                        </td>
                                                        <td><p className={`text-center ${val.isDone ? 'text-decoration-line-through' : ''}`}>{val.description}</p></td>
                                                        <td className="text-center">
                                                            <p className={`badge ${val.isDone ? 'badge-success' : 'badge-danger'}`}>{val.isDone ? 'completed' : 'pending'}</p></td>
                                                        <td className="text-center"><Todopopup val={val} todosRef={todosRef} />
                                                            <button className="btn btn-sm mx-1" onClick={() => handleDelete(val.id)}><Delete /></button></td>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Droppable>
                    ) : ''}
                </div>

            </DragDropContext>
            <Modal
                show={isLoading}
                centered
                backdrop="static"
                keyboard={false}

                className="d-flex justify-content-center"
            >
                <Dna
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />
            </Modal>
        </div>
    );
};
