import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Dashboard = ({ setAuth }) => {
  const [contacts, setContacts] = useState([]);
  
  // Updated state to include Notes and Tags
  const [inputs, setInputs] = useState({
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactNotes: "",
    contactTags: ""
  });

  // Get all contacts
  async function getContacts() {
    try {
      const response = await fetch("http://localhost:5000/dashboard/contacts", {
        method: "GET",
        headers: { token: localStorage.getItem("token") }
      });
      const parseRes = await response.json();
      setContacts(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  }

  // Create a Contact
  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (inputs.contactPhone.length !== 10 || isNaN(inputs.contactPhone)) {
        return toast.error("Phone number must be exactly 10 digits!");
    }

    try {
      const body = { 
        name: inputs.contactName, 
        phone: inputs.contactPhone, 
        email: inputs.contactEmail,
        notes: inputs.contactNotes,
        tags: inputs.contactTags
      };

      const response = await fetch("http://localhost:5000/dashboard/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token")
        },
        body: JSON.stringify(body)
      });
      
      const parseRes = await response.json();
      
      if (response.ok) {
          getContacts(); 
          // Clear all inputs including notes/tags
          setInputs({ contactName: "", contactPhone: "", contactEmail: "", contactNotes: "", contactTags: "" }); 
          toast.success("Contact Added!");
      } else {
          toast.error("Failed to add contact");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  async function toggleFavorite(id) {
    try {
      await fetch(`http://localhost:5000/dashboard/contacts/favorite/${id}`, {
        method: "PUT",
        headers: { token: localStorage.getItem("token") }
      });
      getContacts();
    } catch (err) {
      console.error(err.message);
    }
  }

  async function deleteContact(id) {
    try {
      await fetch(`http://localhost:5000/dashboard/contacts/${id}`, {
        method: "DELETE",
        headers: { token: localStorage.getItem("token") }
      });
      setContacts(contacts.filter(contact => contact.contact_id !== id));
      toast.success("Contact Deleted");
    } catch (err) {
      console.error(err.message);
    }
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    getContacts();
  }, []);

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1>My Contacts</h1>
        <button className="btn btn-danger" onClick={(e) => logout(e)}>
          Logout
        </button>
      </div>

      {/* ADD CONTACT FORM */}
      <div className="card p-4 mb-4 bg-light shadow-sm">
        <h4>Add New Contact</h4>
        <form onSubmit={onSubmitForm} className="row g-2">
          <div className="col-md-3">
            <input type="text" name="contactName" placeholder="Name" className="form-control" value={inputs.contactName} onChange={onChange} required />
          </div>
          <div className="col-md-3">
            <input type="text" name="contactPhone" placeholder="Phone (10 digits)" className="form-control" value={inputs.contactPhone} onChange={onChange} required />
          </div>
          <div className="col-md-3">
            <input type="email" name="contactEmail" placeholder="Email" className="form-control" value={inputs.contactEmail} onChange={onChange} required />
          </div>
          <div className="col-md-3">
             {/* New Tag Input */}
            <input type="text" name="contactTags" placeholder="Tags (e.g. Work)" className="form-control" value={inputs.contactTags} onChange={onChange} />
          </div>
          <div className="col-md-12">
            {/* New Notes Input */}
            <textarea name="contactNotes" placeholder="Add notes here..." className="form-control" value={inputs.contactNotes} onChange={onChange} rows="2"></textarea>
          </div>
          <div className="col-md-12">
            <button className="btn btn-success btn-block w-100">Add Contact</button>
          </div>
        </form>
      </div>

      {/* CONTACT LIST */}
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Fav</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Tags</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <tr key={contact.contact_id} className={contact.is_favorite ? "table-warning" : ""}>
                <td>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => toggleFavorite(contact.contact_id)}
                    style={{ fontSize: "1.2rem", color: contact.is_favorite ? "orange" : "gray", border: "none", background: "none" }}
                  >
                    {contact.is_favorite ? "★" : "☆"}
                  </button>
                </td>
                <td style={{ fontWeight: contact.is_favorite ? "bold" : "normal" }}>{contact.name}</td>
                <td>{contact.phone}</td>
                <td>{contact.email}</td>
                
                {/* Display Tags with a blue badge look */}
                <td>
                    {contact.tags && <span className="badge bg-primary">{contact.tags}</span>}
                </td>
                
                {/* Display Notes (small text) */}
                <td><small className="text-muted">{contact.notes}</small></td>
                
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteContact(contact.contact_id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No contacts found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;