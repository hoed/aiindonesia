import { useState } from 'react';

const App = () => {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")
    const [chatHistory, setChatHistory] = useState([])

    const surpriseOptions = [
        'Who is the Indonesian Presiden now?',
        'Where is the Rawon come from?',
        'How do you make coffee latte?'
    ]

    const surprise = () => {
       const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
        setValue(randomValue)
    }

    const getResponse = async () => {
        if (!value) {
            setError("error! Please ask a question!")
            return
        }
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    history: chatHistory,
                    message: value
                }),
                headers: { 'Content-Type': 'application/json' },
            }

            const response = await fetch('https://localhost:8000/gemini', options)
            const data = await response.text()
            console.log(data)
            setChatHistory(oldChatHistory => [...oldChatHistory, {
                role: "user",
                parts: value
            },
                {
                    role: "model",
                    parts: data
                }
            ])
            setValue("")
        } catch (error) {
            console.error(error)
            setError("Something went wrong! Please try again later")
        }
    }

    const clear = () => {
        setValue("")
        setError("")
        setChatHistory([])
    }

  return (
      <div className="app">
        <p>What do you want to know today?
          <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise Me</button>
        </p>
          <div className="input-container">
              <input
                  value={value}
                  placeholder="Ask me everything"
                  onChange={(e) => setValue(e.target.value)}
                />
              {!error && <button onClick={getResponse}>Go</button>}
              {error && <button onClick={clear}>Clear</button>}
          </div>
          {error && <p>{error}</p>}
          <div className="search-results">
              {chatHistory.map((chatItem, _index) => <div key={_index}>
                  <p className="answer">{chatItem.role} : {chatItem.parts}</p>
              </div>)}
          </div>
      </div>

  )
}

export default App;
