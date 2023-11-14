import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { db } from '../firebase/firebase';
import { Dna } from 'react-loader-spinner'
import Modal from 'react-bootstrap/Modal'
import { Edit,Delete } from "@mui/icons-material";
import {
    collection,
    addDoc,
    where,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    getDocs,
    documentId
} from 'firebase/firestore';
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const Todo = () => {
    const [value, setValue] = useState({ title: "", description: "" });
    const [error, setError] = useState({ title: "", description: "" });
    const [todoList, setTodolist] = useState([]);
    const [checkItems, setCheckItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate=useNavigate();
    const todosRef = collection(db, `todos/${id}/todos`);
    // const todosRef=doc(todos,"dinesh");

    useEffect(() => {
        setIsLoading(true);

        const queryMessages = query(todosRef, orderBy("createdAt", "desc"));

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

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!value.title) {
            setError((error) => ({
                ...error,
                title: 'Please enter todo title',
            }));
            return;
        }
        if (!value.description) {
            setError((error) => ({
                ...error,
                description: 'Please enter todo description'
            }));
            return;
        }
        if (value.id) {
            const updateRef = doc(todosRef, value.id);
            updateDoc(updateRef, { ...value });
            setValue({})
            return;
        }
        try {
            await addDoc(todosRef, { ...value, isDone: false, createdAt: serverTimestamp() });
            setValue({});
        } catch (error) {
            console.error('Error adding message: ', error);
        }

    };

    const handleDelete = (id) => {
        deleteDoc(doc(todosRef, id));
    }

    const handleCheckBox = (id) => {
        if (checkItems.includes(id)) {
            setCheckItems(checkItems.filter((item) => item !== id));
        } else {
            setCheckItems([...checkItems, id]);
        }
    }

    const allCheck = (e) => {
        if (e.target.checked) {
            let allItems = todoList.map((item) => item.id);
            setCheckItems(allItems);
        } else {
            setCheckItems([]);
        }
    }

    const completed = async () => {
        if (checkItems.length) {
            try {
                const q = query(todosRef, where(documentId(), 'in', checkItems));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((document) => {
                    updateDoc(doc(todosRef, document.id), { ...document.data(), isDone: true });
                    //console.log(doc.id, " => ", doc.data());
                });


            } catch (error) {
                console.log(error);
            }
        }
    }

    const changeEvent = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
        if (e.target.name === "title") {
            setError({
                ...error,
                title: "",
            });
        }
        if (e.target.name === "description") {
            setError({
                ...error,
                description: ""
            });
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return; // If the item was dropped outside of the list, do nothing
        }

        const items = Array.from(todoList);
        const [reorderedItem] = items.splice(result.source.index, 1); // Remove the dragged item
        items.splice(result.destination.index, 0, reorderedItem); // Insert the item at the new position

        setTodolist(items);
    };
    const handleLogout=()=>{
        cookies.remove('auth-token');
        cookies.remove('user-icon');
        navigate('/');
    }
    if(!cookies.get('auth-token')){
        return <h3 className="d-flex justify-content-center align-items-center vh-100"><Link to={'/'}>Login </Link>{' '} to continue</h3>
    }
    return (
       <div className="min-vh-100 p-2">
       <DragDropContext onDragEnd={onDragEnd}>
        <div className="d-flex justify-content-center">
        <div className="my-3 h2 mr-2">Todo Application</div>
        <div className="dropdown">
                    <button className="btn m-2 dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={cookies.get('user-icon')} className='img-fluid rounded-circle'
                            style={{ height: '2rem', width: '2rem' }} alt='...' />
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        
                            <li><p className="dropdown-item text-center" role='button' onClick={handleLogout}>Logout</p></li>
                            
            
                    </ul>
                </div>
        </div>
           
           <div className="container my-4 py-1 border">
               <form className="mt-3 mb-2" id="todoForm" onSubmit={onSubmit}>
                   <div className="row">
                       <div className="col-xl-3">
                           <label className="sr-only">Name</label>
                           <input
                               type="text"
                               name="title"
                               className="form-control mb-2 mr-sm-3"
                               placeholder="Todo Title"
                               value={value.title ? value.title : ''}
                               onChange={(e) => changeEvent(e)}
                           />
                           <span className="text-danger">{error.title}</span>
                       </div>

                       <div className="col-xl-3">
                           <label className="sr-only">Description</label>
                           <input
                               type="text"
                               name="description"
                               className="form-control mb-2 mr-sm-3"
                               placeholder="Description"
                               value={value.description ? value.description : ''}
                               onChange={(e) => changeEvent(e)}
                           />
                           <span className="text-danger">{error.description}</span>
                       </div>

                       <div className="col-xl-4 d-grid gap-2 d-md-block">
                           {/* {value.id ? <span className="mx-2"><input type="checkbox" id="completed" checked={value.isDone}
                               onChange={() => setValue({ ...value, isDone: !value.isDone })} /> Completed</span> : ''} */}
                           <button className="btn btn-primary mb-2" type="submit">{value.id ? 'Update todo' : 'Save todo'}</button>
                           {value.id ? <button className="btn btn-secondary mb-2 mx-2" onClick={() => setValue({})}>Cancel</button> : ''}
                       </div>
                   </div>
               </form>
           </div>
           {todoList.length ? (
               <div className="container my-4 py-1">
                   <div className="mb-2 float-right">
                       <button className="btn btn-success" onClick={completed}>Mark as Completed</button>
                   </div>

                   <Droppable droppableId="todoList">
                       {(provided) => (
                           <Table striped bordered hover variant="">
                               <thead>
                                   <tr>
                                       <th className="text-center">
                                           <input
                                               type="checkbox"
                                               id="allItems"
                                               onChange={(e) => allCheck(e)}
                                               
                                           />
                                       </th>
                                       <th className="text-center">Title</th>
                                       <th className="text-center">Description</th>
                                       <th className="text-center">Status</th>
                                       <th className="text-center">Actions</th>
                                   </tr>
                               </thead>
                               <tbody ref={provided.innerRef}>
                                   {todoList.map((value, index) => (
                                       <Draggable key={value.id} draggableId={value.id} index={index}>
                                           {(provided) => (
                                               <tr
                                                   ref={provided.innerRef}
                                                   {...provided.draggableProps}
                                                   {...provided.dragHandleProps}
                                               >
                                                   <td className="text-center"> <input
                                                       type="checkbox"
                                                       id={value.id}
                                                       value={value.id}
                                                       checked={checkItems.includes(value.id)}
                                                       onChange={() => handleCheckBox(value.id)}
                                                   />
                                                   </td>
                                                   <td><p className="text-center">{value.title}</p></td>
                                                   <td><p className={`text-center ${value.isDone?'text-decoration-line-through':''}`}>{value.description}</p></td>
                                                   <td className="text-center">
                                                    <p className={`badge ${value.isDone ? 'badge-success' : 'badge-danger'}`}>{value.isDone ? 'completed' : 'pending'}</p></td>
                                                   <td className="text-center"><button className="btn btn-sm"
                                                       onClick={() => {
                                                           setValue(value)
                                                           setError({})
                                                       }}><Edit/></button>
                                                       <button className="btn btn-sm mx-1" onClick={() => handleDelete(value.id)}><Delete/></button></td>
                                               </tr>
                                           )}
                                       </Draggable>
                                   ))}
                               </tbody>
                           </Table>
                       )}
                   </Droppable>

               </div>
           ) : ''}
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
