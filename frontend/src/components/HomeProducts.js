import React, { useContext } from 'react'
import HomeContext from '../context/HomeContext';
import { Button } from '@mui/material';

export default function HomeProducts() {
  const { products } = useContext(HomeContext);
  return (
    <div className="products-container">
      {products?.map((e) => (
        <div key={e.id} className='product-card'>
          <div className='img-box'>
            <img src={e.thumbnail} alt={e.title} />
          </div>
          <div className='product-infos-box'>
           <h1>{e.title}</h1>
           <p className='price'>{e.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className='button-site-box'>
            <Button variant='contained' size='small'>Ir a web</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
