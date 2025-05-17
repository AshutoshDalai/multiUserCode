import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import ACTIONS from '../Actions'
import { useLocation ,useNavigate,Navigate,useParams } from 'react-router-dom'

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reacrNavigator = useNavigate();
  const { roomID } = useParams();
  // roomID
  


  const [clients,setClients]=useState([]);

  useEffect(()=>{
    const init = async ()=>{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error',(err)=>handleErrors(err));
      socketRef.current.on('connect_failed',(err)=>handleErrors(err));

      function handleErrors(e){
        console.log('socket error',e);
        toast.error('Socket connection failed. Try Again Later');
        reacrNavigator('/');
      }


      socketRef.current.emit(ACTIONS.JOIN,{
        roomID,
        username:location.state?.username,
      });
      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({clients,username,socketId})=>{
          // Mera alawa Sabko
          if(username !== location.state?.username){
            toast.success(`${username} joined the room.`)
            console.log(`${username}Joined`);
          }
          setClients(clients);
          // When Client joined the whole msg is showing to them so ->
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code:codeRef.current,
            socketId,
          });
        }
      )
      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
        toast.success(`${username} left the room`);

        // remove the client from dashboard
        setClients((prev)=>{
          return prev.filter(
            (client)=>client.socketId!==socketId
          )
        })
      })
    }
    init();
    return ()=>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.off(ACTIONS.DISCONNECTED)
    }
  },[])
  
  
  async function copyRoomId(){
    try {
      await navigator.clipboard.writeText(roomID)
     
      toast.success('Room ID has been copied to your clipboard')
    } catch (error) {
      toast.error('Could not copy the Room ID');
      console.error(error);
    }
  }

  function leaveRoom(){
    reacrNavigator('/')
  }

  if(!location.state){
    return <Navigate to="/" />
  }

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
           <div className='logo'>
            <img className='logoimage' src = '/code-sync.png' alt = 'logo'/>
           </div>
           <h3>
            Connected
           </h3>
           <div className='clientlist'>
            {clients.map((client)=>(
              <Client 
              key = {client.socketId}
              username={client.username}
               />
            ))}
           </div>
        </div>
        <button className='btn copybtn' onClick={copyRoomId}>Copy Room ID</button>
        <button className='btn leavebtn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='editorwrap'>
        <Editor socketRef={socketRef} roomID={roomID} onCodeChange={(code)=>{
          codeRef.current = code;
        }}/>
        </div>
    </div>
  )
}
 
export default EditorPage