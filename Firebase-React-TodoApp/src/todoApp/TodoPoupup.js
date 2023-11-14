import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText, Input } from '@mui/material';
import { Edit } from '@mui/icons-material';
import {
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getCountFromServer
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
 
} from "firebase/storage";
import { storage } from '../firebase/firebase';
import { nanoid } from '@reduxjs/toolkit';
export default function Todopopup({val,todosRef}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] =React.useState({});
  const [error, setError] = React.useState({description: "" });
  const [image,setImage] =React.useState(null)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError({})
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!value.description) {
        setError((error) => ({
            ...error,
            description: 'Please enter task name'
        }));
        return;
    }
    if (value.id) {
        const updateRef = doc(todosRef, value.id);
        updateDoc(updateRef, { ...value });
        setValue({})
        handleClose();
        return;
    }
    try {
        if(image){
          const imageRef = ref(storage, `images/${image.name + nanoid()}`);
          uploadBytes(imageRef, image)
          .then((snapshot) => {
           console.log(snapshot)
           
              // Get the download URL of the uploaded image
              getDownloadURL(snapshot.ref)
                .then((url) => {
                  // Log the URL to the console
                  console.log(url);
        
                  // Update the state with the URL
                  setValue({ ...value, imageUrl: url });
                });

          });
        }
        const snapshot = await getCountFromServer(todosRef);
        await addDoc(todosRef, { ...value, isDone: false, createdAt: serverTimestamp(),order:snapshot.data().count +1 });
        setValue({});
        handleClose();
    } catch (error) {
        console.error('Error adding message: ', error);
    }

};
const changeEvent = (e) => {
  setValue({
      ...value,
      [e.target.name]: e.target.value,
  });
  if (e.target.name === "description") {
      setError({
          ...error,
          description: ""
      });
  }
  else setError({...error,description: "Please enter task name"});
};
  return (
    <React.Fragment>
       {val.id?<Button   onClick={()=>{
        setValue({...val})
        handleClickOpen();
        }}><Edit/></Button>:<button className='btn w-50 btn-outline-primary' onClick={()=>{
        setValue({})
        handleClickOpen();
        }}>
       + New Task
      </button>} 
      
      <Dialog open={open} onClose={handleClose} >
        <DialogTitle> New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            name='description'
            fullWidth
            variant="standard"
            value={value.description ? value.description : ''}
            onChange={(e) => changeEvent(e)}
            placeholder='Enter your Task'
        
          /><div className='d-flex flex-column my-2'>
            <label htmlFor='image' className='small fw-bold'>Upload Image(optional):</label>
          <Input type='file' id='image' className='mt-1' onChange={(e)=>setImage(e.target.files[0])}/>
          </div>
          
          <DialogContentText><span className="text-danger">{error.description?error.description:''}</span></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={(e)=>onSubmit(e)}>{value.id?'Update':'Create'}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}