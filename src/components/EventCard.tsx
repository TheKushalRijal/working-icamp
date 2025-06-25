import React from 'react';

interface EventCardProps {
  title: string;
  date: string;
  image: string;
  location: string;
  description: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, image, location, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img
            src={image}
            alt={title}
            className="h-48 w-full object-cover md:h-full"
            loading="lazy"
          />
        </div>
        <div className="p-4 md:w-2/3">
          <h3 className="text-xl font-bold text-[#2A4365] mb-2">{title}</h3>
          <div className="text-gray-600 mb-2">
            <p>{new Date(date).toLocaleDateString()}</p>
            <p>{location}</p>
          </div>
          <p className="text-gray-700 mb-4">{description}</p>
          <button className="bg-[#38B2AC] text-white px-6 py-2 rounded-full hover:bg-[#319795] transition-colors">
            Join Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;