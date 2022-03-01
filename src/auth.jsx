import { useState } from 'react';
import _ from 'lodash';

function Login({ loggedIn, setLoggedIn }) {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    async function handleClick() {
        const user = {
            "username": username,
            "password": password
        };
        const res = await fetch('http://127.0.0.1:8000/game/auth/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(user)
        }).then(r => r.json());
        (res.ok) ? setLoggedIn(true) : setLoggedIn(false);

    }
    if (!loggedIn) {

        return (
            <div className="flex flex-col space-y-4 mt-4 items-center justify-center">
                <input
                    className='bg-blue-200 px-5 ring-blue-900 ring-offset-2 ring-2 rounded mr-4'
                    type="text"
                    value={username}
                    placeholder="Username"
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className='bg-blue-200 px-5 ring-blue-900 ring-offset-2 ring-2 rounded mr-4'
                    type="text"
                    value={password}
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    className='bg-blue-500 rounded ring-2 ring-blue-400 ring-offset-2 px-2 py-1'
                    onClick={() => handleClick()}
                >
                    LOGIN
                </button>
            </div>
        );
    }
    return (<></>);
}

export { Login };