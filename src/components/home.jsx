import { useEffect, useState } from 'react';
import './home.css'
import io from 'socket.io-client';


function Home() {

    const [nome, setNome] = useState("");
    const [findnome, setFindNome] = useState("");

    const [message, setMessage] = useState("");
    const [dados, setDados] = useState([]);

    var connectionOptions = {
        "force new connection": true,
        "reconnectionAttempts": "Infinity",
        "timeout": 10000,
        "transports": ["websocket"]
    };
    const socket = io('https://chat-node-w6h8.onrender.com', connectionOptions);


    function renderMessage() {

        let fullDate = new Date().toLocaleString('pt-BR')

        if (findnome && message) {
            socket.emit('chatmsg', nome, message, fullDate);
            setMessage("")
        } else {
            alert("Campos vazios !")
        }
    }


    function createName() {
        if (nome !== '') {
            setFindNome(nome)
            window.localStorage.setItem('name', nome);

        }
    }

    function sair() {
        window.localStorage.removeItem('name');
        setFindNome("")
    }

    socket.on('chatmsg', (dados) => {

        setDados(dados);

    })

    useEffect(() => {

        const name = window.localStorage.getItem('name');
        if (name) {
            setFindNome(name)
        }

        var connectionOptions = {
            "force new connection": true,
            "reconnectionAttempts": "Infinity",
            "timeout": 10000,
            "transports": ["websocket"]
        };
        const socket = io('https://chat-node-w6h8.onrender.com', connectionOptions);
        socket.emit('getchatmsg')

    }, [])
    
    return (
        <div>
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-12 p-3">
                        {findnome ? <div><button type="button" className="btn btn-outline-primary" disabled>Bem vindo, {findnome} !</button> <button type="button" className="btn btn-danger btn-sm" onClick={sair}>SAIR</button></div>
                            :
                            <div className="input-group ">
                                <input type="text" className="form-control" placeholder="Nome" aria-label="name" aria-describedby="basic-addon2" onChange={(e) => setNome(e.target.value)} />
                                <button className='btn btn-primary' onClick={createName}>Salvar</button>
                            </div>
                        }
                    </div>
                </div>
                <div className='container border chat rounded'>
                    <table className="table table-striped table-borderless border text-start">
                        <tbody>
                            {dados.map((item, index) => (
                                <tr key={index}>
                                    <td>[{item.fullDate}] <strong>{item.nome}:</strong> {item.mensagem}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 ">
                        <textarea name="" id="" cols="170" rows="1" className='form-control' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 d-grid">
                        <button className='btn btn-primary' onClick={renderMessage}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home;