io.on('connection', (socket) => {
    console.log('Client connected');

    // Event handler for messages received from client
    socket.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Broadcast the message to all connected clients
        io.emit('message', message);
    });

    // Event handler for disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
