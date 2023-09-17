
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.stats = pokeDetail.stats.map((stat) => {
        return {
            name: stat.stat.name,
            value: stat.base_stat
        }
    })
    pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => {
        return {
            name: abilitySlot.ability.name
        }
    })
    pokemon.description = pokeDetail.description
    pokemon.caracter= [pokeDetail.height * 10,pokeDetail.weight / 10]
    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    return pokemon
}
pokeApi.getPokemonsDetailSpecie = (pokemon) => {
    return fetch(pokemon.species.url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody)
        .then((specie) => {
            const flavorTextEntries = specie.flavor_text_entries
            const newPokemon = pokemon
            newPokemon.description = {
                base_happiness: specie.base_happiness,
                capture_rate: specie.capture_rate,
                description: flavorTextEntries.find((flavorText) => flavorText.language.name === 'en').flavor_text,
            }
            return newPokemon;
        })
}
pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(pokeApi.getPokemonsDetailSpecie)
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
