document.addEventListener('DOMContentLoaded', () => {
  // Element selections
  const elList = document.querySelector('.list');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const sortSelect = document.getElementById('sortSelect'); // Sorting control
  const favoritesButton = document.getElementById('favoritesButton');
  const favoritesMenu = document.getElementById('favoritesMenu');
  const closeFavoritesButton = document.getElementById('closeFavoritesButton');
  const favoritesList = document.querySelector('.favorites-list');
  const clearFavoritesButton = document.getElementById('clearFavoritesButton');

  let favorites = [];
  // Variable to store the currently displayed list (filtered or complete)
  let currentPokemons = pokemons.slice();

  // Create a Pokemon card element
  function createPokemonItem(item, isFavorite = false) {
    let newItem = document.createElement('li');
    newItem.className = 'item';
    newItem.innerHTML = `
      <span class="id">${item.num}</span>
      <h2 class="name">${item.name}</h2>
      <img class="img" src="${item.img}" alt="${item.name}">
      <p class="type">${item.type.join(', ')}</p>
      <strong class="weight">${item.weight}</strong>
      <h4 class="candy">Candy count: ${item.candy_count || 'N/A'}</h4>
      <h3 class="weaknesses">${item.weaknesses.join(', ')}</h3>
      <span class="spawn">${item.spawn_time}</span>
      <button class="star ${isFavorite ? 'favorite' : ''}">★</button>
    `;
    const starButton = newItem.querySelector('.star');
    starButton.addEventListener('click', () => {
      const isFav = starButton.classList.toggle('favorite');
      if (isFav) {
        addFavorite(item);
      } else {
        removeFavorite(item);
      }
    });
    return newItem;
  }

  // Render Pokémon cards into the container
  function renderPokemon(pokemonArray, container) {
    container.innerHTML = ""; // Clear container before rendering
    pokemonArray.forEach(item => {
      const newItem = createPokemonItem(item, container === favoritesList);
      container.appendChild(newItem);
    });
  }

  // Sort function: sorts by name in ascending ('az') or descending ('za') order
  function sortPokemons(arr, order = 'az') {
    return arr.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return order === 'az' ? -1 : 1;
      if (nameA > nameB) return order === 'az' ? 1 : -1;
      return 0;
    });
  }

  // Filter function: filters based on search input then applies sort
  function filterPokemons() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );
    // Save filtered result into currentPokemons
    currentPokemons = filteredPokemons;
    // Apply current sort order
    const sortOption = sortSelect.value;
    filteredPokemons = sortPokemons(filteredPokemons, sortOption);
    renderPokemon(filteredPokemons, elList);
  }

  // Re-sort currentPokemons when the sort order changes
  sortSelect.addEventListener('change', () => {
    const sortOption = sortSelect.value;
    // Create a shallow copy so as not to mutate currentPokemons permanently
    const sorted = sortPokemons(currentPokemons.slice(), sortOption);
    renderPokemon(sorted, elList);
  });

  // Favorites functions
  function addFavorite(pokemon) {
    if (!favorites.includes(pokemon)) {
      favorites.push(pokemon);
      renderPokemon(favorites, favoritesList);
    }
  }

  function removeFavorite(pokemon) {
    favorites = favorites.filter(fav => fav.num !== pokemon.num);
    renderPokemon(favorites, favoritesList);
  }

  // Event listeners for search
  searchButton.addEventListener('click', filterPokemons);
  searchInput.addEventListener('input', filterPokemons);

  // Favorites menu event listeners
  favoritesButton.addEventListener('click', () => {
    document.body.classList.add('menu-open');
    favoritesMenu.style.display = 'block';
  });

  closeFavoritesButton.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    favoritesMenu.style.display = 'none';
  });

  clearFavoritesButton.addEventListener('click', () => {
    favorites = [];
    renderPokemon(favorites, favoritesList);
  });

  // Initial sort and render using the default sort option (A–Z)
  currentPokemons = sortPokemons(pokemons.slice(), sortSelect.value);
  renderPokemon(currentPokemons, elList);
});
