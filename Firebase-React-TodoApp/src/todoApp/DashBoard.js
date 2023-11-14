import React from 'react'
import './DashBoard.css'
import { PieChart } from '@mui/x-charts/PieChart';
import {
    onSnapshot,
    query,
    orderBy,
    limit,
} from 'firebase/firestore';
function DashBoard({ todosRef, list }) {
    const [todoList, setTodolist] = React.useState([]);
    const completed = list.filter((item) => item.isDone);
    const percentage = Math.round((completed.length / list.length) * 100)
    const data = [
        { id: 0, value: percentage, label: 'completed' },
        { id: 1, value: 100-percentage, label: 'pending' },

    ];
    React.useEffect(() => {


        const queryMessages = query(todosRef, orderBy("createdAt", "desc"), limit(3));

        if (queryMessages === undefined) {
            console.log("query undefined");
            return;
        }
        const freeup = onSnapshot(queryMessages, (snapshot) => {
            //console.log("snapshot data:", snapshot.docs.map((doc) => doc.data()));

            try {
                setTodolist(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            } catch (error) {
                console.error(error);
            }
        });
        return freeup;
    }, []);
    return (
        <div className=' my-4 py-1'>
            <h3>Task Dashboard</h3>
            <div className='row d-flex flex-wrap justify-content-center'>
                <div className='dashcard col-sm-3 m-2 p-0 shadow-lg mb-3 rounded'>
                    <div className='bg-light p-2 dashcard rounded' style={{ boxShadow: '7px 0px 0px rgb(8, 139, 226) inset' }}>
                        <small className='text-info text-uppercase fw-bold m-2'>Task Completed</small>
                        <p className='h3 p-2'>{completed.length}/{list.length}</p>
                        <div className="progress mx-3">
                            <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: `${percentage}%` }}
                                aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div className='dashcard col-sm-3 m-2 p-0 shadow-lg mb-3 rounded'>
                    <div className='bg-light p-2 dashcard rounded' style={{ boxShadow: '7px 0px 0px rgb(112, 235, 112) inset' }}>
                        <small className='text-success text-uppercase fw-bold m-2'>Recently Added</small>
                        <div>
                            {todoList && todoList.map((todo) => <div key={todo.id} className='d-flex align-items-center ml-3'>
                                <input
                                    type="checkbox"
                                    id={todo.description}
                                    checked={todo.isDone}
                                    readOnly
                                    disabled
                                />
                                <p className='text-center m-2'>{todo.description}</p>
                            </div>)}
                        </div>
                    </div>

                </div>
                <div className='dashcard col-sm-3 m-2 p-0 shadow-lg mb-3 rounded'>
                    <div className='bg-light p-2 dashcard rounded' style={{ boxShadow: '7px 0px 0px rgb(112, 235, 112) inset' }}>
                        <PieChart
                            series={[
                                {
                                    data,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            height={120}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashBoard