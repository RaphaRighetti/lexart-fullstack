import React, { useMemo, useState } from 'react';
import './styles/home.css'
import HomeContext from '../context/HomeContext';
import HomeForm from '../components/HomeForm';
import HomeProducts from '../components/HomeProducts';

export default function Home() {

  const [web, setWeb] = useState('all');
  const [category, setCategory] = useState('celular');
  const [search, setSearch] = useState('');
  const [mlProducts, setMlProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const value = useMemo(() => ({
    web,
    setWeb,
    category,
    setCategory,
    search,
    setSearch,
    mlProducts,
    setMlProducts,
    isLoading,
    setIsLoading,
  }), [web, category, search, mlProducts, isLoading]);
  return (
    <HomeContext.Provider value={ value }>
      <HomeForm />
      <HomeProducts />
    </HomeContext.Provider>
  );
};
