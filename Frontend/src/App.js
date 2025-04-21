import React, { useState } from 'react';
import styled from 'styled-components';

// Estilos con styled-components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-bottom: 5px;
`;

const Input = styled.input`
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const Message = styled.p`
    color: ${props => props.error ? 'red' : 'green'};
    margin-top: 10px;
`;

const App = () => {
    const [nombre, setNombre] = useState('');
    const [dni, setDni] = useState('');
    const [foto, setFoto] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!nombre || !dni || !foto) {
            setMessage('Por favor, llena todos los campos.');
            setLoading(false);
            return;
        }

        if (dni.length !== 8) {
            setMessage('El DNI debe tener exactamente 8 caracteres.');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('dni', dni);
            formData.append('foto', foto);

            console.log('Sending request:', { nombre, dni, foto: foto ? foto.name : null });

            const response = await fetch('http://localhost:3118/api/usuarios', {
                method: 'POST',
                body: formData,
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                setMessage('Usuario registrado correctamente!');
                setNombre('');
                setDni('');
                setFoto(null);
                document.querySelector('input[type="file"]').value = ''; // Clear file input
            } else {
                const errorData = await response.json();
                console.log('Error response:', errorData);
                setMessage(`Error: ${errorData.error || 'Error desconocido'}`);
            }
            setLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage(`Error: ${error.message}`);
            setLoading(false);
        }
    };

    return (
        <Container>
            <h1>Registro de Usuario</h1>
            <Message error={message.startsWith('Error')}>{message}</Message>
            {loading && <p>Cargando...</p>}
            <Form onSubmit={handleSubmit}>
                <Label>Nombre:</Label>
                <Input
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                />
                <Label>DNI:</Label>
                <Input
                    type="text"
                    value={dni}
                    onChange={e => setDni(e.target.value)}
                    maxLength="8"
                    required
                />
                <Label>Foto:</Label>
                <Input
                    type="file"
                    onChange={e => setFoto(e.target.files[0])}
                    accept="image/png,image/jpeg,image/jpg"
                    required
                />
                <Button type="submit" disabled={loading}>Registrar</Button>
            </Form>
        </Container>
    );
};

export default App;