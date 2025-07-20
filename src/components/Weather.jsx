import Day from "./Day";

export default function Weather({ weather, location }) {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weather;

  // Fix for country flag emojis
  // Fix: support city names with spaces, extract flag from last word
  const lastSpaceIndex = location.lastIndexOf(" ");
  const cityName = location.slice(0, lastSpaceIndex);
  const flag = location.slice(lastSpaceIndex + 1);

  return (
    <div>
      <h2>
        {cityName} <span>{flag}</span>
      </h2>
      <ul className="weather">
        {dates.map((date, i) => (
          <Day
            key={date}
            date={date}
            max={max[i]}
            min={min[i]}
            code={codes[i]}
            isToday={i === 0}
          />
        ))}
      </ul>
    </div>
  );
}
