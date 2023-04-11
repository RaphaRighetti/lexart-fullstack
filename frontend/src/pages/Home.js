import React, { useMemo, useState } from 'react';
import './styles/home.css'
import HomeContext from '../context/HomeContext';
import HomeForm from '../components/HomeForm';
import HomeProducts from '../components/HomeProducts';

export default function Home() {

  const [web, setWeb] = useState('todas');
  const [category, setCategory] = useState('celular');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  
  const value = useMemo(() => ({
    web,
    setWeb,
    category,
    setCategory,
    search,
    setSearch,
    products,
    setProducts,
  }), [web, category, search, products]);
  return (
    <HomeContext.Provider value={ value }>
      <HomeForm />
      <HomeProducts />
    </HomeContext.Provider>
  );
};
