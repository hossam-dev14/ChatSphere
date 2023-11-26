import React from 'react'
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

function App() {
  const [chatActive, setChatActive] = React.useState(false);
  const [username, setUsername] = React.useState('');

  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');


  const handleUsername = (e)=>{
    e.preventDefault();

    if(!username){
      return alert('username is required');
    } 

    setChatActive(!chatActive);
  }



  const handleChatMessage = (e)=>{
    e.preventDefault();

    if(!newMessage){
      return;
    }

    const Message = {
      user:username,
      message:newMessage,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
    }

    socket.emit('sendMessage',Message);
    setNewMessage('');
  }

  React.useEffect(()=>{
    socket.on('receiveMessage',(data)=>{
      setMessages(allMessages => [...allMessages,data]);
    });
    console.log(messages);
  }
  ,[]
  );

  return (
    <>
      <div className='w-screen h-screen bg-gray-300 '>
        {
          chatActive ? 
          
          (
            <div className='p-6'>

              <h1 className='text-xl font-bold text-center'>Group Chat</h1>

                <div className='overflow-scroll overflow-x-hidden scroll-smooth h-[80vh] p-3 mb-2'>
                    {
                      messages.map(
                        (m,i) => (
                          <div key={i} className={`flex ${m.user == username ? 'justify-end' : 'justify-start'}`}>

                            <div className='bg-gray-200 border-2 rounded-md p-2 my-2 flex gap-2 shadow-md w-fit'>

                                <div className='bg-green-400 px-1 flex items-center font-bold' >
                                  <span>{m.user.charAt(0).toUpperCase()}</span>
                                </div>
                                
                              <div>
                                  <span className='text-gray-500'>{m.user}</span>
                                  <p className='font-bold'>{m.message}</p>
                                  <span className='text-sm text-gray-500'> {m.time}</span>
                              </div>

                            </div>

                          </div>
                        )
                      )
                    }
                </div>

              <form onSubmit={handleChatMessage} className='flex gap-2 flex-col sm:flex-row sm:gap-3 sm:justify-between'>

              <input type="text" placeholder='Type ypur message...' value={newMessage} onChange={e=> setNewMessage(e.target.value)} className='outline-none py-2 px-3 rounded-md w-full' />

              <input type="submit" value="Send" className='bg-green-500 text-white py-2 px-3 rounded-md font-bold active:bg-green-400 cursor-pointer' />

              </form>

            </div>

          ) 
          
          : 
          
          (
            <div className='w-screen h-screen flex justify-center items-center gap-1'>

              <input type="text" placeholder='username' value={username} onChange={e=> setUsername(e.target.value)} className='text-center outline-none py-2 px-3 rounded-md' />

              <button type='submit' onClick={handleUsername} className='bg-green-500 text-white py-2 px-3 rounded-md font-bold active:bg-green-400'>Start Chat</button>

            </div>
          )
        }
      </div>
    </>
  )
}

export default App