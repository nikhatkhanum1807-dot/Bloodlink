import React, { useEffect, useState } from "react";

function App() {
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/donors`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch donors");
        return res.json();
      })
      .then((data) => {
        setDonors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

const addDonor = async () => {
  if (!name || !bloodGroup || !phone || !city) {
    alert("Please fill all fields");
    return;
  }

  if (phone.length < 10) {
    alert("Please enter a valid phone number");
    return;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        bloodGroup,
        phone,
        city,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add donor");
    }

    const newDonor = await response.json();

    setDonors((prev) => [...prev, newDonor.donor]);

    setName("");
    setBloodGroup("");
    setPhone("");
    setCity("");

    alert("Donor Added Successfully!");
  } catch (err) {
    alert(err.message);
  }
};
const deleteDonor = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/donors/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete donor");
    }

    setDonors((prev) => prev.filter((donor) => donor._id !== id));
  } catch (err) {
    alert(err.message);
  }
};
  const filteredDonors = donors.filter((donor) =>
  donor.name.toLowerCase().includes(search.toLowerCase()) ||
  donor.city.toLowerCase().includes(search.toLowerCase()) ||
  donor.bloodGroup.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff5f5, #ffe5e5)",
        padding: "40px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            color: "#c1121f",
            fontSize: "3rem",
            marginBottom: "10px",
          }}
        >
          🩸 BloodLink
        </h1>

        <p
          style={{
            color: "#555",
            fontSize: "18px",
          }}
        >
          Connecting Blood Donors With People In Need
        </p>

        <div
          style={{
            display: "inline-block",
            marginTop: "15px",
            background: "#c1121f",
            color: "white",
            padding: "10px 20px",
            borderRadius: "30px",
            fontWeight: "bold",
          }}
        >
          Total Registered Donors: {donors.length}
        </div>
      </div>

      {loading && (
        <p style={{ textAlign: "center" }}>
          Loading donors...
        </p>
      )}

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          Error: {error}
        </p>
      )}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          maxWidth: "700px",
          margin: "0 auto 30px auto",
        }}
      >
        <h2>Add New Donor</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "12px",
          }} />

        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "12px",
          }}
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "12px",
          }} />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "12px",
          }} />

        <button
          onClick={addDonor}
          style={{
            background: "#c1121f",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add Donor
        </button>
      </div>

      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search Name, City or Blood Group"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            width: "300px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "20px",
          }} />
      </div>

      <h2 style={{ textAlign: "center", color: "#c1121f" }}>
        Available Donors ({filteredDonors.length})
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {filteredDonors.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#666",
              gridColumn: "1 / -1",
            }}
          >
            <h3>No donors found</h3>
            <p>
              Try searching with a different name, city, or blood group.
            </p>
          </div>
        )}
        {filteredDonors.map((d) => (
          <div
            key={d._id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              borderLeft: "6px solid #c1121f",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                background: "#c1121f",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              {d.name.charAt(0).toUpperCase()}
            </div>

            <h3
              style={{
                color: "#c1121f",
                marginBottom: "10px",
              }}
            >
              {d.name}
            </h3>

            <span
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Available
            </span>

            <p style={{ marginTop: "12px" }}>
              🩸 Blood Group:
              <span
                style={{
                  background: "#fee2e2",
                  color: "#c1121f",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  marginLeft: "8px",
                  fontWeight: "bold",
                }}
              >
                {d.bloodGroup}
              </span>
            </p>

            <p>📍 City: {d.city}</p>

            <p>📞 Phone: {d.phone}</p>

            <button
              onClick={() => {
                if (window.confirm("Delete this donor?")) {
                  deleteDonor(d._id);
                }
              } }
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Delete Donor
</button>
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          padding: "20px",
          color: "#666",
        }}
      >
        <hr />
        <p>🩸 BloodLink - Connecting Blood Donors With People In Need</p>
        <p>Built using React, Node.js, Express & MongoDB</p>
      </div>

    </div>
  );
}
export default App;