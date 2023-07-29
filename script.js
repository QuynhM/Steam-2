// GET DATA
// data of 6 genres
const getGenreNames = async () => {
    try{
        const url = "https://steam-api-mass.onrender.com/genres?limit=6";
        const res = await fetch(url);
        const {data} = await res.json();
        return data;
    } catch (error) {
        console.log("Error:", error)
    }
}

// data of all games
let genre = "";
let page = 1;
const search = document.getElementById("searchForm");

const getAllGamesData = async () => {
  try {
    let queryString = `limit=12&page=${page}`;

    if (genre) {
      queryString += `&genres=${genre}`;
    }

    if (search.value) {
      queryString += `&q=${search.value}`;
    }

    const url = `https://steam-api-mass.onrender.com/games?${queryString}`;
    const res = await fetch(url);
    const { data } = await res.json();
    return data;
    // console.log()
  } catch (error) {
    console.log("Error:", error);
  }
};

// games detail 
const getGameDetail = async (appid) => {
    try {
      const url = `https://steam-api-mass.onrender.com/single-game/${appid}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.log("Error:", error);
    }
};

// DISPLAY 
const displayGame = (gameData) => {
    const gameDiv = document.createElement("div");
    gameDiv.className = "game";
    gameDiv.id = `${gameData.appid}`;
    //Image
    const imgElement = document.createElement("img");
    imgElement.src = gameData.header_image;
    imgElement.alt = gameData.name;
    gameDiv.appendChild(imgElement);
    //Name
    const titleElement = document.createElement("h3");
    titleElement.className = "title";
    titleElement.textContent = gameData.name;
    gameDiv.appendChild(titleElement);
    //Price
    const priceElement = document.createElement("span");
    priceElement.className = "price";
    if (gameData.price === 0) {
        priceElement.textContent = "Free";
    } else {
        priceElement.textContent = "$" + gameData.price;
    }
    gameDiv.appendChild(priceElement);
    //Genre
    const genreElement = document.createElement("span");
    genreElement.className = "genre";
    genreElement.textContent = gameData.genres;
    gameDiv.appendChild(genreElement);

    return gameDiv;
};

const displayGameDetail = async (gameData) => {
    const appid = gameData.appid;
  
    // Create game detail container
    const detailDiv = document.createElement("div");
    detailDiv.className = "gameDetails";
    detailDiv.dataset.appid = appid;
  
    // Fetch game detail using getGameDetail
    const gameDetail = await getGameDetail(appid);
  
    // Access the properties of gameDetail and add them to detailDiv
    const titleElement = document.createElement("h3");
    titleElement.textContent = gameDetail.name;
    titleElement.id = "genre-name";
    detailDiv.appendChild(titleElement);
  
    const imgElement = document.createElement("img");
    imgElement.src = gameDetail.header_image;
    imgElement.alt = gameDetail.name;
    detailDiv.appendChild(imgElement);
  
    const priceElement = document.createElement("span");
    priceElement.className = "price";
    if (gameDetail.price === 0) {
      priceElement.textContent = "Free to play";
    } else {
      priceElement.textContent = "$" + gameDetail.price;
    }
    detailDiv.appendChild(priceElement);
  
    const genreElement = document.createElement("span");
    genreElement.className = "genre";
  
    let genresText = gameDetail.genres.map(toTitleCase);
    genresText = genresText.join(", ");
    genreElement.textContent = genresText;
    detailDiv.appendChild(genreElement);
  
    const gameDesciption = document.createElement("span");
    gameDesciption.textContent = gameDetail.description;
    gameDesciption.className = "description";
    detailDiv.appendChild(gameDesciption);

    const backBtn = document.getElementById("back-btn");
    backBtn.style.display = "flex";

    const moreBtn = document.getElementById("next-btn");
    moreBtn.style.display = "none";

  return detailDiv;
};

const displaySearchBar = (genre) => {
    const genresButton = document.createElement("li");
    genresButton.className = "genre";
    genresButton.id = `${genre.name}`;
    genresButton.textContent =
      genre.name.charAt(0).toUpperCase() + genre.name.slice(1);
    return genresButton;
  };


// RENDER 
const renderGames = async () => {
    //Change page title
    const title = document.getElementById("genre-name");
    title.textContent = "GAMES";

    //Get data
    const data = await getAllGamesData();

    //Display All Game (AUTO)
    const ulGameGallery = document.getElementById("game-gallery");
    ulGameGallery.innerHTML = "";
    data.forEach((gameData) => {
        // Display
    const gameDiv = displayGame(gameData);
    ulGameGallery.append(gameDiv);

    // Event Handler to get game detail
    gameDiv.addEventListener("click", async () => {
      const gameSection = document.getElementById("game-gallery");
      gameSection.innerHTML = "";
      //Erase Genre Name
      const genreName = document.getElementById("genre-name");
      genreName.innerHTML = "";
      const detailData = await getGameDetail(gameData.appid);
      const detailDiv = await displayGameDetail(detailData);
      gameSection.appendChild(detailDiv);
    });
  });
};

renderGames();