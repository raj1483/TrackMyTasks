import React from 'react';

const NotFound = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>404</h1>
            <p style={styles.message}>Oops! The page you are looking for does not exist.</p>
            <a href="/" style={styles.link}>Go back to Home</a>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
    },
    title: {
        fontSize: '6rem',
        margin: '0',
        color: '#dc3545',
    },
    message: {
        fontSize: '1.5rem',
        margin: '20px 0',
    },
    link: {
        fontSize: '1rem',
        color: '#007bff',
        textDecoration: 'none',
        border: '1px solid #007bff',
        borderRadius: '4px',
        padding: '10px 20px',
        transition: 'background-color 0.3s, color 0.3s',
    },
};

export default NotFound;
