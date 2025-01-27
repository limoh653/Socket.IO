import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [formInputs, setFormInputs] = useState({});
  const [crudData, setCrudData] = useState([]); // Initialize as an empty array
  const [isEdit, setIsEdit] = useState(false);
  const socket = io("http://localhost:3000");

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formInputs.name || !formInputs.age || !formInputs.number) {
      console.error("All fields must be filled before submitting.");
      return;
    }

    const newData = {
      ...formInputs,
      id: uuidv4(), // Generate a unique ID for the new data
    };

    socket.emit("data", newData); // Send the new data to the server
    setFormInputs({}); // Clear the input fields after submission
  };

  const handleEdit = () => {
    if (!formInputs.id) {
      console.error("No item selected for editing.");
      return;
    }

    console.log("Submitting edited data:", formInputs);
    socket.emit("editData", formInputs); // Emit the edited data to the server
    setIsEdit(false); // Reset edit mode
    setFormInputs({}); // Clear the form inputs
  };

  const handleDelete = (id) => {
    console.log("Deleting item with ID:", id);
    socket.emit("deleteData", id); // Emit the delete request to the server
  };

  useEffect(() => {
    // Listen for updated CRUD data from the server
    socket.on("crudData", (response) => {
      console.log("Updated data received from server:", response);
      if (Array.isArray(response)) {
        setCrudData(response); // Update the UI with the latest data
      } else {
        console.error("Unexpected response format:", response);
      }
    });

    return () => {
      socket.off("crudData"); // Clean up listener
    };
  }, []);

  const getEditData = (data) => {
    setFormInputs(data);
    setIsEdit(true);
  };

  return (
    <>
      <h1>CRUD Operations</h1>
      <div className="form-fields">
        <input
          onChange={handleInput}
          className="input-field"
          name="name"
          placeholder="Enter your name"
          value={formInputs.name || ""}
        />
        <input
          onChange={handleInput}
          className="input-field"
          name="age"
          placeholder="Enter your age"
          value={formInputs.age || ""}
        />
        <input
          onChange={handleInput}
          className="input-field"
          name="number"
          placeholder="Enter your phone number"
          value={formInputs.number || ""}
        />
      </div>
      <button onClick={isEdit ? handleEdit : handleSubmit}>
        {isEdit ? "Edit" : "Add"} Data
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(crudData) && crudData.length > 0 ? (
            crudData.map((data, index) => (
              <tr key={index}>
                <td>{data.name}</td>
                <td>{data.age}</td>
                <td>{data.number}</td>
                <td>
                  <button onClick={() => getEditData(data)}>Edit</button>
                  <button onClick={() => handleDelete(data.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default App;
