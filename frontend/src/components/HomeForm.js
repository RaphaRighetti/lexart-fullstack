import React, { useContext } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import HomeContext from '../context/HomeContext';

export default function HomeForm() {
  const { web, setWeb, category, setCategory, search, setSearch, setMlProducts, isLoading, setIsLoading } = useContext(HomeContext);
  const url = process.env.API_URL || 'https://lexart-backend-production.up.railway.app';

  const fetchProducts = async () => {
    setIsLoading(true);
    const headers = { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    const newUrl = `${url}/${web}/${category}?q=${search}`;
    const response = await fetch(newUrl, { headers, method: 'GET' });
    const data = await response.json();
    setMlProducts(data);
    setIsLoading(false);
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
          <MenuItem value="all">Todas</MenuItem>
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
        <Button variant="contained" size="medium" onClick={ fetchProducts } disabled={isLoading}>Pesquisar</Button>
      </FormControl>
    </div>
  )
}
