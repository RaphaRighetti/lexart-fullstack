import React, { useContext } from 'react'
import HomeContext from '../context/HomeContext';
import { Button } from '@mui/material';

export default function HomeProducts() {
  const { mlProducts, isLoading } = useContext(HomeContext);
  return (
    <div className="products-container">
      {isLoading && <div className="lds-dual-ring" />}
      {Array.isArray(mlProducts) && !isLoading && mlProducts?.map((e) => (
        <div key={e.link} className="product-card">
          <div className="img-box">
            <img src={e.image} alt={e.title} />
          </div>
          <div className="product-infos-box">
           <h1>{e.title}</h1>
           <p className="category">{e.category}</p>
           <p className="price">{e.price}</p>
          </div>
          <div className="button-site-box">
            <a href={ e.link }>
            <Button variant="contained" size="small">Ir a web</Button>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
