import * as Util from '@/utils/common'

import MoneyImage from '@/publics/money.png'
import GallonImage from '@/publics/gallon.png'
import StarImage from '@/publics/star.png'

import AssetItem from './AssetItem'

export default function AssetsList({ user, clan }) {
  return (
    <>
      <div className="flex flex-row gap-x-1 text-xl">
        <div className="font-extrabold text-purple-800">Assets</div>
        <div className="font-light text-gray-600">List</div>
      </div>

      <div className="flex flex-col w-52 mt-4 bg-purple-50 p-5 rounded-2xl shadow-lg">
        <div className="font-medium text-gray-500 mb-2">Your items</div>
        <div className="flex flex-row items-center">
          <AssetItem
            image={MoneyImage}
            value={Util.numberWithCommas(user.properties.money)}
            unit="coin"
          />
        </div>

        <div className="font-medium text-gray-500 mt-4 mb-2">Clan items</div>
        <div className="space-y-4">
          <AssetItem
            image={GallonImage}
            value={Util.numberWithCommas(clan.fuel)}
            unit="gallon"
          />
          <AssetItem
            image={StarImage}
            value={clan.owned_planet_ids.length}
            unit="star"
          />
        </div>
      </div>
    </>
  )
}