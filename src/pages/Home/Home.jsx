import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import EventCard from '../../components/EventCard/EventCard';
import './Home.css';

const eventosHome = [
  {
    id: 1,
    name: "Ultra Music Festival",
    date: "Sábado, 14 de maio",
    dataCompleta: "2024-05-14",
    horario: "22:00",
    location: "Palácio Sunset",
    minPrice: 350,
    category: "eletronica",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Rock in Rio",
    date: "Sexta, 20 de maio",
    dataCompleta: "2024-06-20",
    horario: "20:00",
    location: "Parque Sunset",
    minPrice: 450,
    category: "rock",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Funk Invasion",
    date: "Domingo, 22 de maio",
    dataCompleta: "2024-07-22",
    horario: "21:00",
    location: "Arena Night",
    minPrice: 120,
    category: "funk",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Trap Nation",
    date: "Sábado, 28 de maio",
    dataCompleta: "2024-08-28",
    horario: "23:00",
    location: "Club 338",
    minPrice: 200,
    category: "rap/trap",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const filteredEvents = eventosHome.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (event) => {
    const cartItem = {
      eventoId: event.id,
      artista: event.name,
      data: event.date,
      dataEvento: event.dataCompleta,
      horario: event.horario,
      local: event.location,
      tipo: "Pista",
      lote: "Lote 1",
      preco: event.minPrice,
      quantidade: 1,
      imagem: event.image
    };
    addToCart(cartItem);
    navigate('/meu-carrinho');
  };

  const handleSaibaMais = (eventId) => {
    navigate(`/evento/${eventId}`);
  };

  return (
    <div className="home">
      <div className="top-bar">
        <div className="search-wrapper">
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <div className="filters-wrapper">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>
      </div>
      <div className="events-grid">
        {filteredEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event}
            onAddToCart={() => handleAddToCart(event)}
            onSaibaMais={handleSaibaMais}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;