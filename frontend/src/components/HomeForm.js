import React, { useContext } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import HomeContext from '../context/HomeContext';
import categories from '../utils/categories';

export default function HomeForm() {
  const { web, setWeb, category, setCategory, search, setSearch, setProducts } = useContext(HomeContext);

  const fetchProducts = async () => {
    const query = search.replaceAll(' ', '%20');
    const url = `https://api.mercadolibre.com/sites/MLB/search?category=${categories[category]}&q=${query}`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    setProducts(data.results);
    console.log(data);
  };

  return (
    <div className="form-box">
      <FormControl>
        <InputLabel id="web-label">Web</InputLabel>
        <Select
          labelId="web-label"
          label="Web"
          value={ web }
          onChange={ ({ target }) => setWeb(target.value) }
        >
          <MenuItem value="todas">Todas</MenuItem>
          <MenuItem value="mercadolivre">MercadoLivre</MenuItem>
          <MenuItem value="buscape">Buscapé</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
       <InputLabel id="category-label">Categorias</InputLabel>
        <Select
          labelId="category-label"
          label="Categorias"
          value={ category }
          onChange={ ({ target }) => setCategory(target.value) }
        >
          <MenuItem value="geladeira">Geladeira</MenuItem>
          <MenuItem value="tv">TV</MenuItem>
          <MenuItem value="celular">Celular</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id="standard-basic"
        label="Pesquisa"
        variant="outlined"
        value={ search }
        onChange={ ({ target }) => setSearch(target.value) }
      />
      <FormControl style={ { marginBottom: 1 } }>
        <Button variant="contained" size="medium" onClick={ fetchProducts }>Pesquisar</Button>
      </FormControl>
    </div>
  )
}
