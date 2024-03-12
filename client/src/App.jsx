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
    if(!username) return alert('username is required');
    setChatActive(!chatActive);
  }

  const handleChatMessage = (e)=>{
    e.preventDefault();
    if(!newMessage) return;
    const Message = {
      user:username,
      message:newMessage,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
    }

    socket.emit('sendMessage', Message);
    setNewMessage('');
  }

  React.useEffect(()=>{
    socket.on('receiveMessage',(data)=>{
      setMessages(allMessages => [...allMessages, data]);
    });
    console.log(messages);
  }
  ,[socket]
  );

  return (
    <>
      <div className='w-screen h-screen bg-gray-700 '>
        {
          chatActive ? 
          (
            <div className=''>

              {/* <h1 className='text-xl font-bold text-center text-gray-200'>Group Chat</h1> */}
                <div className='overflow-x-hidden scroll-smooth h-[80vh] p-7'>
                    {
                      messages.map(
                        (m,i) => (
                          <div key={i} className={`flex mb-3 ${m.user == username ? 'justify-end border-bg-sky-600' : 'justify-start border-bg-rose-600'}`}>
                            <div className='bg-gray-200 rounded-md py-1 px-2 my-3 flex gap-2 shadow-md w-fit relative'>
                                <div className={`${m.user == username ? 'bg-gradient-to-l from-sky-800 to-sky-200 right-[-17px] rounded-bl-none' : 'bg-gradient-to-r from-orange-700 to-orange-200 right-[-17px] rounded-br-none left-[-20px]'} rounded-full  shadow-md text-sm px-1 flex items-center font-medium w-7 h-7 p-3 absolute top-[-17px]`} >
                                  {/* <span className=''>{m.user.toUpperCase()}</span> */}
                                  <span className=''>{m.user == username ? 'ME' : m.user.slice(0, 2).toUpperCase()}</span>
                                </div>
                              <div className='relative '>
                                  {/* <span className='text-gray-500'>{m.user}</span> */}
                                  <p className='font-normal text-lg'>{m.message}</p>
                                  <span className={`text-xs absolute  text-gray-300 ${m.user == username ? 'right-2 top-[-23px]': 'left-2 top-[-23px]'}`}>{m.time}</span>
                              </div>
                            </div>
                          </div>
                        )
                      )
                    }
                </div>

              <form onSubmit={handleChatMessage} className='flex gap-2 flex-col sm:flex-row sm:gap-3 sm:justify-between fixed bottom-4 left-3 right-3'>

              <input type="text" placeholder='Type ypur message...' value={newMessage} onChange={e=> setNewMessage(e.target.value)} className='outline-none py-2 px-3 rounded-md w-full' />
              <input type="submit" value="Send" className='bg-emerald-500 text-white py-2 px-3 rounded-md font-bold hover:bg-emerald-400 cursor-pointer' />
              </form>
            </div>
          ) : (
            <div className='w-screen h-screen flex justify-center items-center gap-1 flex-col sm:flex-row max-w-3xl'>
              <input type="text" 
                placeholder='username' 
                value={username} 
                onChange={e=> setUsername(e.target.value)} className='text-center outline-none py-2 px-3 min-w-52 rounded-md' />
              <button type='submit' 
                onClick={handleUsername} 
                className='bg-emerald-500 text-white p-2 rounded-md font-semibold hover:bg-emerald-400 min-w-52'>Start Chat</button>
            </div>
          )
        }
      </div>
    </>
  )
}

export default App



