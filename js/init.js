const tisaneContainer = document.querySelector('.tisanes');


let produits = [];
let cart = [];

const cartCount = document.getElementById("cart-count");
const cartBody = document.getElementById("cart-body");
const cartTotal = document.getElementById("cart-total");


// Affichage des produits

async function fetchData() {

    try {
        // appele de la fonction JSON
        const response = await fetch("produit.json");

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();


        produits = data;   // AJOUT : sauvegarde des produits

        // efface le container
        tisaneContainer.innerHTML = "";

        // Boucle de remplissige
        data.forEach((e) => {
            tisaneContainer.innerHTML += `
                <div class="col-12 col-sm-6 col-md-4 mb-4">
                    <div class="card h-100 shadow-sm border-0 card-tisane" style="background-color: #F8F5F0;">
                        <img src="${e.img}" class="card-img-top img-fluid" alt="${e.nom}" style="height: 200px; object-fit: cover;">
                        
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold" style="color: #2D5A27;">${e.nom}</h5>
                            <p class="card-text text-muted flex-grow-1">${e.description}</p>
                            <p class="fs-5 fw-bold text-success">${e.prix.toFixed(2)} $</p>
                                                        
                            <div class="d-grid gap-2 mt-3">
                                <button class="btn btn-success add-to-cart" data-id="${e.id}">Ajouter au panier</button>
                                <button class="btn btn-outline-secondary btn-sm view-details"  
                                        data-bs-toggle="modal" 
                                        data-bs-target="#tisaneModal" data-id="${e.id}"data-nom="${e.nom}" data-prix = ${e.prix} data-img="${e.img}" data-description="${e.description}">
                                    Détails
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        //onclick="afficherDetails(${e.id})"
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        tisaneContainer.innerHTML = `<p class="text-danger">Impossible de charger les produits pour le moment.</p>`;
    }
}

// Appele de la fonction
fetchData();

tisaneContainer.addEventListener("click", (e) => {

    const btnDetails = e.target.closest(".view-details");
    if (btnDetails) {
        const { id, nom, prix, img, description } = btnDetails.dataset;
        showProductModal(id, nom, parseFloat(prix), img, description);
        return;
    }

    const btnAdd = e.target.closest(".add-to-cart");
    if (btnAdd) {
        const id = parseInt(btnAdd.dataset.id);
        ajouterAuPanier(id);
    }
});

function showProductModal(id, nom, prix, img, description) {
    const modalInner = document.querySelector("#modal-content-inner");

    modalInner.innerHTML = `
        <div class="row g-0">
            <div class="col-md-5">
                <img src="${img}" class="img-fluid h-100 w-100" alt="${nom}" style="object-fit: cover; min-height: 300px;">
            </div>
            <div class="col-md-7 d-flex flex-column p-4">
                <div class="modal-header border-0 p-0 mb-3">
                    <h2 class="modal-title fs-4 fw-bold">${nom}</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0 flex-grow-1">
                    <p class="text-success fs-3 fw-bold mb-2">${prix.toFixed(2)} $</p>
                    <p class="text-muted">${description}</p>
                </div>
                <div class="modal-footer border-0 p-0 mt-4">
                    <button type="button" class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Fermer</button>
                    <button id="btn-modal-add" class="btn btn-success px-4">Ajouter au panier</button>
                </div>
            </div>
        </div>`;

    // Initialisation et affichage du modal
    const modalElement = document.getElementById("tisaneModal");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();

    // Gestionnaire de clic pour le bouton "Ajouter au panier" à l'intérieur du modal
    document.getElementById("btn-modal-add").onclick = () => {
        ajouterAuPanier(parseInt(id));
        modalInstance.hide(); // Optionnel : ferme le modal après l'ajout
    };
}
/*function afficherDetails(id) {

    const produit = produits.find(p => p.id === id);  // AJOUT

    document.getElementById("modalTitle").textContent = produit.nom;
    document.querySelector(".modal-body .card-text").textContent = produit.description;
    document.querySelector(".modal-body .fs-5").textContent = produit.prix.toFixed(2) + " $";
    document.querySelector(".modal-content img").src = produit.img;

    // AJOUT : bouton modal lié au panier
    const btnModal = document.querySelector("#tisaneModal .btn-success");
    btnModal.onclick = () => ajouterAuPanier(id);
}*/


// Ajout dun element dans le panier 


function ajouterAuPanier(id) {

    const produit = produits.find(p => p.id === id);

    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantite++;   // si déjà dans panier
    } else {
        cart.push({
            id: produit.id,
            nom: produit.nom,
            prix: produit.prix,
            quantite: 1
        });
    }

    mettreAJourPanier();
}


// mise à jour du panier


function mettreAJourPanier() {

    // compteur total articles
    cartCount.textContent = cart.reduce((total, item) => total + item.quantite, 0);

    cartBody.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total += item.prix * item.quantite;

        cartBody.innerHTML += `
            <p>
                ${item.nom} x ${item.quantite}
                <span class="float-end">
                    ${(item.prix * item.quantite).toFixed(2)} $
                </span>
            </p>
        `;
    });

    cartTotal.textContent = total.toFixed(2);
}


// vider le panier

document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    mettreAJourPanier();
});



