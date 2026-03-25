import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

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

      const userRes = await fetch(
        `https://api.github.com/users/${username}`
      );

      if (!userRes.ok) {
        throw new Error("User not found");
      }

      const userData = await userRes.json();

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

  //Language Data
  const getLanguageData = () => {
    const langCount = {};
    repos.forEach((repo) => {
      if (repo.language) {
        langCount[repo.language] =
          (langCount[repo.language] || 0) + 1;
      }
    });

    return Object.keys(langCount).map((lang) => ({
      name: lang,
      value: langCount[lang],
    }));
  };

  // AI Insights (logic-based)
  const getInsights = () => {
    if (!repos.length) return [];

    const languages = getLanguageData();
    const topLang = languages.sort((a, b) => b.value - a.value)[0];

    const insights = [];

    if (topLang) {
      insights.push(`Strong in ${topLang.name}`);
    }

    if (userData.followers > 50) {
      insights.push("Good community presence");
    } else {
      insights.push("Can improve GitHub visibility");
    }

    if (userData.public_repos > 20) {
      insights.push("Consistent project builder");
    } else {
      insights.push("Needs more projects");
    }

    return insights;
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col items-center px-4 py-10 gap-4">

      <h1 className="text-4xl font-bold mb-6">
        DevScope AZ 🚀
      </h1>

      {/* Input */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={fetchUser}
         className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          Analyze
        </button>
      </div>

      {loading && <p className="text-blue-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Profile */}
      {userData && (
        <div className="bg-gray-900 p-6 rounded-xl shadow-xl text-center w-80 mb-8 transform hover:scale-105 transition duration-300">
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

      {/* AI Insights */}
      {userData && (
        <div className="bg-gray-900 p-4 rounded-lg mb-8 w-80">
          <h3 className="font-bold mb-2">AI Insights 🤖</h3>
          {getInsights().map((insight, index) => (
            <p key={index} className="text-sm text-gray-300">
              • {insight}
            </p>
          ))}
        </div>
      )}

      {/* Repositories */}
      {repos.length > 0 && (
        <div className="w-full max-w-3xl mb-10">
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
                  className="bg-gray-900 p-4 rounded-lg flex justify-between"
                >
                  <div>
                    <h3>{repo.name}</h3>
                    <p className="text-sm text-gray-400">
                      {repo.language || "No language"}
                    </p>
                  </div>
                  <div>⭐ {repo.stargazers_count}</div>
                </div>
              ))}
          </div>
        </div>
      )}
{/* Language Chart */}
{repos.length > 0 && (
  <div className="text-center mt-10">
    <h2 className="text-xl font-bold mb-4">
      Language Distribution 📊
    </h2>

    <PieChart width={320} height={320}>
      <Pie
        data={getLanguageData()}
        dataKey="value"
        nameKey="name"
        outerRadius={110}
        label
      >
        {getLanguageData().map((entry, index) => {
          const COLORS = [
            "#3b82f6", 
            "#22c55e", 
            "#f59e0b", 
            "#ef4444", 
            "#a855f7", 
            "#06b6d4", 
          ];

          return (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          );
        })}
      </Pie>
      <Tooltip />
    </PieChart>
  </div>
)}

    </div>
  );
}

export default App;