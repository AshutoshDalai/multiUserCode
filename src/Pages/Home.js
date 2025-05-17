import React, { useState } from 'react'
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// import {uuid} from 'uuid';

const Home = () => {
  const navigate = useNavigate()
  const [roomId,setRoomid]=useState('')
  const [username,setUsername]=useState('')
  const createnewroom = (e)=>{
    // To prevent it from refreshing on click 
    e.preventDefault();
    const id = uuidV4();
    // console.log(id);
    setRoomid(id)
    toast.success('Created a new Room');
  }

  const joinroom = ()=>{
    if(!roomId ){
      toast.error('ROOM ID  is Required')
      return ;
    }
    if(!username){
      toast.error('Username is Required')
      return ;
    }

    // Now redirect
    navigate(`/editor/${roomId}`,{
      state:{
        username,
      }
      // 
    })
  }

  const enterclick = (e)=>{
    // console.log('event',e.code);
    if(e.code === 'Enter'){
      joinroom();
    }
  }
  return (
    <div className='homePageWrapper'>
       <div className='formWrapper'>
        <img className='homePageLogo' src='/code-sync.png' alt='code-sync-logo'/>

        <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
        <div className='inputGroup'>
          <input type='text' className='inputBox' placeholder='ROOM ID' value={roomId} onChange={(e)=>setRoomid(e.target.value)} onKeyUp={enterclick}/>

          <input type='text' className='inputBox' placeholder='USERNAME' value={username} onChange={(e)=>setUsername(e.target.value)} onKeyUp={enterclick}/>
          
          <button onClick={joinroom} className='btn joinBtn'>Join</button>

          <span className='createInfo'>
            If you don't have an invite then create &nbsp;
            <a onClick={createnewroom} href='' className='createNewBtn'>
              new room
            </a>
            {/* nbsp :NON Breaking Space   */}
          </span>
        </div>
       </div>

       <footer>
        <h4>
          Built with 💙 by &nbsp; 
          <a href='https://github.com/AshutoshDalai' target='_blank'>Ashutosh Dalai</a>
        </h4>
       </footer>
    </div>
  )
}

export default Home
