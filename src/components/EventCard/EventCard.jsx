import React from 'react';
import './EventCard.css';

const EventCard = ({ event, onAddToCart, onSaibaMais }) => {
  return (
    <div className="event-card">
      <div className="event-image-container">
        <img src={event.image} alt={event.name} className="event-image" />
      </div>
      <div className="event-info">
        <h3 className="event-name">{event.name}</h3>
        <div className="event-details">
          <div className="event-left">
            <p className="event-date">{event.date}</p>
            <p className="event-location">{event.location}</p>
            <p className="event-price">R$ {event.minPrice}+</p>
          </div>
          <div className="event-right">
            <button 
              className="learn-more-btn"
              onClick={() => onSaibaMais(event.id)}
            >
              Saiba mais
            </button>
            <button 
              className="cart-icon"
              onClick={() => onAddToCart(event)}
            >
              🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;