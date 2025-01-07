// cette fonction est appelée au chargement de la page
async function loadBase() {
    // const url = 'https://api.example.com/data';
    await displayCards();

}
// fonction générique pour charger des données depuis une API
/**
 * loadFromAPI
 * @description charge les données depuis une API
 * @param {string} url 
 * @returns {Promise<*>}
 */
async function loadFromAPI(url) {
    const response = await fetch(url);
    const data = (await response.json());
    return data
}

/**
 * displayCards
 * @description affiche les cartes en utilisant displayCard
 * @returns {Promise<void>}
 */
async function displayCards() {
    const container = document.querySelector('#warper');
    const template = document.querySelector('#card-template');

    let hasMore = true;
    let url = "https://api.scryfall.com/cards/search?q=e:ltr%20lang:fr&format=json&order=set&unique=prints";
    while (hasMore) { // tant qu'il y a des données sur plusieurs pages
        const data = await loadFromAPI(url);

        // on verifie si on a des données
        console.log(`data`, data);
        if (!data) {
            console.error("No data");
            return;
        }

        // on affiche les données
        data.data.forEach(item => {
            displayCard(container, template, item);
        });
        hasMore = data.has_more;
        url = data.next_page;
    }

}

/**
 * displayCard
 * @description affiche une cartes en utilisant un template
 * @returns {Promise<void>}
 */
function displayCard(container, template, data) {

    let clone = document.importNode(template.content, true); // clone le template
    let newContent = clone.firstElementChild.innerHTML
        // .replace(/{{ID}}/g, this.id)
        .replace(/{{text}}/g, data.printed_name)
        .replace(/{{image}}/g, data.image_uris.normal)
        
        // .replace(/{{temp}}/g, this.temp ? `${Math.round(this.temp)} °C` : "N/A")
    clone.firstElementChild.innerHTML = newContent;
    container.appendChild(clone);
}