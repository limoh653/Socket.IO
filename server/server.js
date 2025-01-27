const { createServer } = require("http");
const { Server } = require("socket.io");

// Create the HTTP server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from the frontend
  },
});

let crudData = []; // Array to store all CRUD data

io.on("connection", (socket) => {
  console.log("A client connected");

  // Send the current data to the newly connected client
  socket.emit("crudData", crudData);

  // Handle receiving new data from the client
  socket.on("data", (data) => {
    console.log("Received new data:", data);

    // Add the new data to the array
    crudData.push(data);

    // Broadcast the updated data to all connected clients
    io.emit("crudData", crudData);
  });

  // Handle editing data
  socket.on("editData", (response) => {
    console.log("Edit data received:", response);

    // Find the index of the item to be edited
    const currentIndex = crudData.findIndex((data) => data.id === response.id);

    if (currentIndex !== -1) {
      // Update the item
      crudData[currentIndex] = { ...crudData[currentIndex], ...response };

      // Broadcast the updated data to all clients
      io.emit("crudData", crudData);
      console.log("Updated data broadcasted:", crudData);
    } else {
      console.error("Item not found for editing");
    }
  });

  // Handle deleting data
  socket.on("deleteData", (id) => {
    console.log("Delete request received for ID:", id);

    // Filter out the item to delete
    crudData = crudData.filter((data) => data.id !== id);

    // Broadcast the updated data to all clients
    io.emit("crudData", crudData);
    console.log("Updated data after deletion:", crudData);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

// Start the server
httpServer.listen(3000, () => {
  console.log("Server is connected and listening on http://localhost:3000");
});
