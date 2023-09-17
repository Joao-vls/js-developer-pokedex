const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function createDetailFull(pokemon) {
    let detailFull = document.createElement("section");
    detailFull.classList.add("detailPokemon");
    detailFull.innerHTML =
    `<div class="detailPokemonContainer">
        <div class="detailPokemonImage ${pokemon.type}">
            <div class="divButton">
                <button class="closeDetail">X</button>
                <button><img src="assets/img/cora.png"
                alt="bookmark"></button>
            </div>
            <div class="detailPokemonIdent">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${pokemon.number}</span>
                <div class="detailPokemonTypes">
                    ${pokemon.types.map((type) => `<span class="type ${type}">${type}</span>`).join('')}
                </div>
            </div>
            <img draggable="false"
                src="${pokemon.photo}"
                alt="${pokemon.nome}">
        </div>
        <div class="detailPokemonInfos">
            <div class="divButton">
                <button id="Desc">Description
                <span class="lineAfter  ${pokemon.type}" ></span>
                </button>
                <button id="About">About
                <span class="lineAfter  ${pokemon.type}" ></span>
                </button>
                <button id="BaseSt">Base Stats
                <span class="lineAfter  ${pokemon.type}" ></span>
                </button>
            </div>
        <ol>
        <h4>Description</h4>
        <br>
        ${pokemon.description.description}
        </ol>
        </div>
    </div>`
    document.body.appendChild(detailFull);

    const closeDetail = document.querySelector(".closeDetail");
    const aboutButton = document.getElementById("About");
    const baseButton = document.getElementById("BaseSt");
    const descButton = document.getElementById("Desc");
    descButton.addEventListener("click",()=>{document.querySelector(".detailPokemonInfos ol").innerHTML =`
    <h4>Description</h4>
    <br>
    ${pokemon.description.description}`;});
    baseButton.addEventListener("click",()=>{
            document.querySelector(".detailPokemonInfos ol").innerHTML =`
            ${pokemon.stats.map((stat) => `<li ><span class="stat">${stat.name}</span> <span class="value">${stat.value}</span>   
            <div class="grafic"><div class="line" style="width:${stat.value}px; ${(stat.value<50) ? "background-color:red": ""}"> </div> </div></li>`).join('')}`;
    });
    descButton.focus();
    aboutButton.addEventListener("click",()=>{
            document.querySelector(".detailPokemonInfos ol").innerHTML =`
            <h4>Abilities</h4>
            ${pokemon.abilities.map((ability) => `<li >${ability.name}</li>`).join('')}
            <h4>Caracter</h4>
            <li >Height: ${pokemon.caracter[0]}cm</li>
            <li >Weight: ${pokemon.caracter[1]}kg</li>
            <li >Base Happiness : ${pokemon.description.base_happiness}</li>
            <li >Capture rate : ${pokemon.description.capture_rate}</li>
            `;
    });
    closeDetail.addEventListener("click",()=>{
        document.body.style.overflow = "scroll";
        document.body.removeChild(detailFull)});
}

function createPokemonToLi(pokemon) {
    let liPai = document.createElement("li");
    liPai.classList.add("pokemon", pokemon.type);
    liPai.innerHTML = `   
    <span class="number">#${pokemon.number}</span>
    <span class="name">${pokemon.name}</span>

    <div class="detail">
        <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>

        <img src="${pokemon.photo}"
             alt="${pokemon.name}">
    </div>`
    liPai.addEventListener("click",()=>{
        document.body.style.overflow = "hidden";
        createDetailFull(pokemon)});
    pokemonList.appendChild(liPai);
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemons.map(createPokemonToLi)
    });
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})