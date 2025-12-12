/* Création de la base de données */

/* Récupère le package knew */
const knex = require('knex');

/* Créé une instance de la base de données */
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: "./MANDAT4.sqlite3"
    },
    useNullAsDefault: true
});

/* Fonction qui vérifie si la table utilisateur existe, et la créé si ce n'est pas le cas */
async function createTable() {
    const utilisateur = await db.schema.hasTable("utilisateur")
    /* Si la table n'existe pas, on la créé */
    if (!utilisateur) {
        await db.schema.createTable("utilisateur", (table) => {
            table.string("id").primary();
            table.string("name").notNullable();
            table.integer("numTel").notNullable();
            table.string("password").notNullable();
        });
        console.log("Table 'utilisateur' créée. ")
    }
    const utilisateurConnecte = await db.schema.hasTable("utilisateurConnecte")
    if (!utilisateurConnecte) {
        await db.schema.createTable("utilisateurConnecte", (table) => {
            table.string("id").primary();
            table.string("name").notNullable();
        });
        console.log("Table 'utilisateurConnecte' créée. ")
    }
    const publications = await db.schema.hasTable("publications")
    if (!publications) {
        await db.schema.createTable("publications", (table) => {
            table.string("id").primary();
            table.string("image"); // URL de l'image (peut être null si c'est une vidéo)
            table.string("video"); // URL de la vidéo (peut être null si c'est une image)
            table.string("description"); // Description optionnelle
            table.string("photographer"); // Nom du photographe/vidéaste (Pexels)
            table.string("idAuteur"); // Peut être null pour les publications Pexels
            table.foreign("idAuteur").references("utilisateur.id"); 
            table.integer("nombreLikes").defaultTo(0); 
            table.timestamp("dateCreation").defaultTo(db.fn.now());
        })
        console.log("Table 'publications' créée. ")
    }
    const commentaires = await db.schema.hasTable("commentaires")
    if (!commentaires) {
        await db.schema.createTable("commentaires", (table) => {
            table.string("id").primary();
            table.string('idUtilisateur').notNullable();
            table.string("idAuteur").notNullable();
            /*
            nous sommes conscients que dans une vraie situation, une clé étrangère serait requise
            Pour les besoins de la cause et pour des besoins d'esthétiques, nous n'avons pas mis
            de clé étrangère pour permettre de populer les commentaires afin de voir le nombre d'une 
            publication sans devoir faire plusieurs dizaines de comptes et commenter sur 
            chaque publication

            table.foreign("idAuteur").references("utilisateur.id")*/
            table.string("idPublication").notNullable();
            table.foreign("idPublication").references("publications.id")
            table.string("message").notNullable();
        })
        console.log("Table 'commentaires' créée. ")
    }
    const likes = await db.schema.hasTable("likes")
    if (!likes) {
        await db.schema.createTable("likes", (table) => {
            table.increments("id").primary();
            table.string("idUtilisateur").notNullable();
            /*
            nous sommes conscients que dans une vraie situation, une clé étrangère serait requise
            Pour les besoins de la cause et pour des besoins d'esthétiques, nous n'avons pas mis
            de clé étrangère pour permettre de populer les likes afin de voir le nombre d'une 
            publication sans devoir faire plusieurs dizaines de comptes et aimer chaque publication

            table.foreign("idUtilisateur").references("utilisateur.id").onDelete("CASCADE"); */
            table.string("idPublication").notNullable();
            // Pas de clé étrangère car les publications sont générées dynamiquement
            table.timestamp("dateCreation").defaultTo(db.fn.now());
            table.unique(["idUtilisateur", "idPublication"]); // Un utilisateur ne peut liker qu'une fois
        })
        /* Indique la création de la table */
        console.log("Table 'likes' créée")
    }
}

/* Exporte l'instance db et la fonction createTable */
module.exports = {
    db,
    createTable
};

