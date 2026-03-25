import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch user data
      const userRes = await fetch(
        `https://api.github.com/users/${username}`
      );

      if (!userRes.ok) {
        throw new Error("User not found");
      }

      const userData = await userRes.json();

      // Fetch repos
      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const repoData = await repoRes.json();

      setUserData(userData);
      setRepos(repoData);
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col items-center px-4 py-10">

      <h1 className="text-4xl font-bold mb-6">
        DevScope AI 🚀
      </h1>

      {/* Input Section */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
        />

        <button
          onClick={fetchUser}
          className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Analyze
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-blue-400">Loading...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Profile Card */}
      {userData && (
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center w-80 mb-8">

          <img
            src={userData.avatar_url}
            alt="profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />

          <h2 className="text-xl font-semibold">
            {userData.name || "No Name"}
          </h2>

          <p className="text-gray-400 text-sm mb-3">
            {userData.bio || "No bio available"}
          </p>

          {/* Stats */}
          <div className="flex justify-between mt-4 text-sm">
            <div>
              <p className="font-bold">{userData.followers}</p>
              <p className="text-gray-400">Followers</p>
            </div>

            <div>
              <p className="font-bold">{userData.following}</p>
              <p className="text-gray-400">Following</p>
            </div>

            <div>
              <p className="font-bold">{userData.public_repos}</p>
              <p className="text-gray-400">Repos</p>
            </div>
          </div>

          {/* View Profile */}
          <a
            href={userData.html_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            View Profile
          </a>

        </div>
      )}

      {/* Repositories */}
      {repos.length > 0 && (
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Top Repositories
          </h2>

          <div className="grid gap-4">
            {repos
              .sort((a, b) => b.stargazers_count - a.stargazers_count)
              .slice(0, 5)
              .map((repo) => (
                <div
                  key={repo.id}
                  className="bg-gray-900 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{repo.name}</h3>

                    <p className="text-sm text-gray-400">
                      {repo.language || "No language"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {repo.description || "No description"}
                    </p>
                  </div>

                  <div className="text-sm">
                    ⭐ {repo.stargazers_count}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;