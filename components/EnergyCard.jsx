const EnergyCard = ({ listing }) => {
  return (
    <div className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="space-y-2">
            <p className="text-gray-600">
              Sales: {listing.sales?.toLocaleString()} MWH
            </p>
            <p className="text-gray-500 text-sm">
              Period: {listing.period}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">
            ${listing.price}/kWH
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnergyCard; 