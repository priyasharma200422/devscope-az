import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);

  const fetchUser = async () => {
    const response = await fetch(
      `https://api.github.com/users/${username}`
    );
    const data = await response.json();
    setUserData(data);
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col items-center justify-center px-4">

      <h1 className="text-4xl font-bold mb-6">
        GitHub Analyzer 🚀
      </h1>

      {/* Input Section */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={fetchUser}
          className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Analyze
        </button>
      </div>

      {/* Profile Card */}
      {userData && (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl text-center w-80 hover:scale-105 transition">

          <img
            src={userData.avatar_url}
            alt="profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-blue-500"
          />

          <h2 className="text-xl font-semibold">
            {userData.name || "No Name"}
          </h2>

          <p className="text-gray-400 text-sm mb-3">
            {userData.bio || "No bio available"}
          </p>

          <div className="flex justify-between mt-4 text-sm">
            <div>
              <p className="font-bold">{userData.followers}</p>
              <p className="text-gray-400">Followers</p>
            </div>

            <div>
              <p className="font-bold">{userData.public_repos}</p>
              <p className="text-gray-400">Repos</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;