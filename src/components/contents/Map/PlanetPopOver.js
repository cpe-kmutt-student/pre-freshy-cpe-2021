export default function PlanetPopover({ clan, planet, isHover }) {
  return (
    <>
      {isHover &&
        <div className="flex flex-col text-center absolute z-10 bg-white transform -translate-y-16 px-4 rounded-lg p-2">
          <div className="font-semibold text-indigo-800">{planet.name}</div>
          <div>Tier: {planet.tier}</div>
          <div className="mt-1 text-gray-500">{planet.owner != 0 ? `Owned by Clan ${planet.owner}` : "Unoccupied"}</div>
        </div>
      }
    </>
  )
}