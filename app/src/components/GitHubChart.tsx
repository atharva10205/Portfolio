// components/GitHubChart.jsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function GitHubChart({ username, token, colour }) {
  const [weeks, setWeeks] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchContributions() {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{
            user(login: "${username}") {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }`,
        }),
      });
      const data = await res.json();
      setWeeks(data.data.user.contributionsCollection.contributionCalendar.weeks);
    }

    fetchContributions();
  }, [username, token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [weeks]);

  function getColor(count) {
    if (colour === "orange") {
      if (count === 0) return "#ebedf0";
      if (count <= 3) return "#ffd0a8";
      if (count <= 6) return "#ffaa66";
      if (count <= 9) return "#FF7A00";
      return "#FF6600";
    }
    if (colour === "black") {
      if (count === 0) return "#ffffff";
      if (count <= 3) return "#9ca3af";
      if (count <= 6) return "#6b7280";
      if (count <= 9) return "#374151";
      return "#000000";
    }
  }

  return (
    <div className="relative w-full">
      <div ref={scrollRef} className="flex gap-[3px] overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.contributionDays.map((day, di) => (
              <div
                key={di}
                className="w-[10px] h-[10px] rounded-[2px] cursor-pointer transition-transform hover:scale-125"
                style={{ backgroundColor: getColor(day.contributionCount) }}
                onMouseEnter={(e) =>
                  setTooltip({
                    text: `${day.contributionCount} contributions on ${day.date}`,
                    x: e.clientX,
                    y: e.clientY,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {tooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{ top: tooltip.y - 36, left: tooltip.x - 60 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}