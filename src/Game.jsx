import { useEffect, useState } from 'react';
import _ from 'lodash';

function Guessbox({ word }) {
    return (
        <div className="flex flex-row space-x-1">
            {word.map(([c, color], i) => (
                <div key={i} className="w-16 h-16 flex items-center justify-center text-3xl rounded border-black border-2" style={{ backgroundColor: color }}>
                    <div>
                        {c}
                    </div>
                </div>
            ))}
        </div>
    );
}

function Gamegrid({ guesses }) {
    return (
        <div className="flex flex-col space-y-2 items-center justify-center">
            {guesses.map((g) => <Guessbox word={g} />)}
            {_.range(guesses.length, 6).map((i) => <Guessbox key={i} word={[[" ", "white"], [" ", "white"], [" ", "white"], [" ", "white"], [" ", "white"]]} />)}
        </div>

    );
}




function Game({ loggedIn }) {
    const [state, setState] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [code, setCode] = useState('placeholder');
    const [gameExists, setGameExists] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    useEffect(async () => {
        const res = await fetch('http://127.0.0.1:8000/game/state/', {
            method: 'GET',

            credentials: "include",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }

        }).then(r => r.json());
        if (res.ok) {
            setState(res.guesses);
            setIsPublic(res.is_public);
            setGameExists(true);
            setGameEnded(res.ended);
            if (isPublic) {
                setCode(res.code);
            }
        }
    }, []);
    if (!loggedIn) {
        return (<></>);
    }
    function UserInput() {

        const [text, setText] = useState('');

        async function handleClick() {
            const body = { "guess": text };
            const res = await fetch('http://127.0.0.1:8000/game/guess/', {
                method: 'POST',

                credentials: "include",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(r => r.json());
            console.log(res);
            if (res.ok) {
                setState(res.guesses);
                setGameEnded(res.ended);
            }
        }
        return (
            <div>
                < input className='bg-blue-200 px-5 ring-blue-900 ring-offset-2 ring-2 rounded mr-4'
                    type="text"
                    value={text} placeholder="Guess..."
                    onChange={(e) => setText(e.target.value)
                    } />
                <button onClick={() => handleClick()} className='bg-blue-500 rounded ring-2 ring-blue-400 ring-offset-2 px-2 py-1'>ENTER</button>

            </div>
        );
    }
    function InitLobby() {

        const [inputCode, setInputCode] = useState('');
        const [inputPublic, setInputPublic] = useState(false);
        async function handleClick() {
            if (inputPublic) {
                const body = { "code": inputCode, "is_public": true }
                const join = await fetch('http://127.0.0.1:8000/game/join/', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    credentials: "include",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(r => r.json());
                if (!join.ok) {
                    await fetch('http://127.0.0.1:8000/game/init/', {
                        method: 'POST',
                        mode: 'cors',
                        credentials: "include",
                        body: JSON.stringify({ "is_public": true }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }

            } else {
                await fetch('http://127.0.0.1:8000/game/init/', {
                    method: 'POST',
                    mode: 'cors',
                    credentials: "include",
                    body: JSON.stringify({ "is_public": false }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            const res = await fetch('http://127.0.0.1:8000/game/state/', {
                method: 'GET',

                credentials: "include",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(r => r.json());
            setState(res.guesses);
            setIsPublic(res.is_public);
            setGameExists(true);
            setGameEnded(res.ended);
            if (isPublic) {
                setCode(res.code);
            }
        }
        return (
            <>

                < input className='bg-green-200 px-5 ring-green-900 ring-offset-2 ring-2 rounded mr-4'
                    type="text"
                    value={inputCode} placeholder="Enter code"
                    onChange={(e) => setInputCode(e.target.value)
                    } />

                <button onClick={() => handleClick()} className='bg-green-500 rounded ring-2 ring-green-400 ring-offset-2 px-2 py-1'>START</button>
                <div>
                    <input
                        className='px-5'
                        type="checkbox"
                        checked={inputPublic}
                        onChange={(e) => setInputPublic(e.target.checked)} />
                    public
                </div>
            </>
        );
    }
    return (
        <div className='space-y-4'>
            {isPublic ? <div key={code} >{code}</div> : <></>}
            {gameExists ? <Gamegrid guesses={state} /> : <></>}
            {gameExists ? <UserInput /> : <></>}
            <InitLobby />
        </div>
    );
}


export { Gamegrid };
export default Game;