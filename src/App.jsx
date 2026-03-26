import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

function App() {
  const [mode, setMode] = useState("analyze");
  const [username, setUsername] = useState("");
  const [compareUser, setCompareUser] = useState("");

  const [userData, setUserData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [repos, setRepos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Fetch single user
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error("User not found");

      const data = await res.json();

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const repoData = await repoRes.json();

      setUserData(data);
      setRepos(repoData);
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  // ⚔️ Compare users
  const fetchCompare = async () => {
    setLoading(true);

    const res1 = await fetch(`https://api.github.com/users/${username}`);
    const data1 = await res1.json();

    const res2 = await fetch(
      `https://api.github.com/users/${compareUser}`
    );
    const data2 = await res2.json();

    setUserData(data1);
    setCompareData(data2);
    setLoading(false);
  };

  // 🏆 Score
  const getScore = (user, reposList = []) => {
    if (!user) return 0;

    let score = 0;
    score += Math.min(user.followers, 100);
    score += user.public_repos * 2;

    reposList.forEach((repo) => {
      score += repo.stargazers_count;
    });

    return Math.min(score, 100);
  };

  // 📊 Chart data
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

  // 🤖 Insights
  const getInsights = () => {
    if (!repos.length) return [];

    const insights = [];
    const totalStars = repos.reduce(
      (acc, repo) => acc + repo.stargazers_count,
      0
    );

    if (totalStars > 50) insights.push("Projects gaining attention ⭐");
    else insights.push("Build more impactful projects");

    if (userData.followers > 50)
      insights.push("Strong GitHub presence");
    else insights.push("Increase visibility");

    return insights;
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen text-white flex flex-col items-center px-4 py-10 gap-8">

      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        DevScope AZ 
      </h1>

      {/* 🔘 MODE SWITCH */}
      <div className="flex gap-4 bg-gray-800 p-2 rounded-xl">
        <button
          onClick={() => setMode("analyze")}
          className={`px-6 py-2 rounded-lg transition ${
            mode === "analyze"
              ? "bg-gradient-to-r from-blue-500 to-purple-600"
              : "hover:bg-gray-700"
          }`}
        >
          Analyze
        </button>

        <button
          onClick={() => setMode("compare")}
          className={`px-6 py-2 rounded-lg transition ${
            mode === "compare"
              ? "bg-gradient-to-r from-purple-500 to-pink-600"
              : "hover:bg-gray-700"
          }`}
        >
          Compare
        </button>
      </div>

      {/* 🔍 ANALYZE MODE */}
      {mode === "analyze" && (
        <>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchUser()}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={fetchUser}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-lg hover:scale-105 transition"
            >
              Analyze
            </button>
          </div>

          {loading && <p className="text-blue-400">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* PROFILE CARD */}
          {userData && (
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-80 text-center hover:scale-105 transition">

              <img
                src={userData.avatar_url}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-purple-500"
              />

              <h2 className="text-xl font-semibold">{userData.login}</h2>

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

              <p className="mt-3 text-purple-400 font-bold">
                Score: {getScore(userData, repos)}/100
              </p>
            </div>
          )}

          {/* 🤖 AI INSIGHTS */}
          {userData && (
            <div className="bg-gray-900 p-4 rounded-xl shadow-md w-80">
              <h3 className="font-bold mb-2 text-purple-400">
                AI Insights 🤖
              </h3>
              {getInsights().map((i, idx) => (
                <p key={idx} className="text-sm text-gray-300">
                  • {i}
                </p>
              ))}
            </div>
          )}

          {/* 📊 CHART */}
          {repos.length > 0 && (
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-bold mb-4 text-center">
                Language Distribution 📊
              </h2>

              <PieChart width={320} height={320}>
                <Pie data={getLanguageData()} dataKey="value" outerRadius={110}>
                  {getLanguageData().map((entry, index) => {
                    const COLORS = [
                      "#3b82f6",
                      "#22c55e",
                      "#f59e0b",
                      "#ef4444",
                      "#a855f7",
                    ];
                    return (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    );
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          )}
        </>
      )}

      {/* ⚔️ COMPARE MODE */}
      {mode === "compare" && (
        <>
          <div className="flex gap-3">
            <input
              placeholder="User 1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 bg-gray-800 rounded-lg"
            />
            <input
              placeholder="User 2"
              value={compareUser}
              onChange={(e) => setCompareUser(e.target.value)}
              className="px-4 py-2 bg-gray-800 rounded-lg"
            />
            <button
              onClick={fetchCompare}
              className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-2 rounded-lg"
            >
              Compare
            </button>
          </div>

          {userData && compareData && (
            <div className="flex gap-6">
              <div className="bg-gray-900 p-4 rounded-xl text-center">
                <h3>{userData.login}</h3>
                <p>{getScore(userData)}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-xl text-center">
                <h3>{compareData.login}</h3>
                <p>{getScore(compareData)}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;