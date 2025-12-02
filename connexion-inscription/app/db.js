/* Création de la base de données */

/* Récupère le package knew */
const knex = require('knex');

/* Créé une instance de la base de données */
const db = knex({
    client: 'sqlite3',
    connection : {
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
            table.string("password").notNullable();
        });
        console.log("Table 'utilisateur' créée. ")
    }
    const utilisateurConnecte = await db.schema.hasTable("utilisateurConnecte")
    if (!utilisateurConnecte){
        await db.schema.createTable("utilisateurConnecte", (table) => {
            table.string("id").primary();
            table.string("name").notNullable();
        });
        console.log("Table 'utilisateurConnecte' créée. ")
    }
    const publications = await db.schema.hasTable("publications")
    if (!publications){
        await db.schema.createTable("publications", (table) => {
            table.string("id").primary();
            table.string("name").notNullable();
            table.string("image").notNullable();
            table.string("biographie").notNullable();
            table.string("idAuteur").notNullable();
            table.foreign("idAuteur").references("utilisateur.id")
            table.string("nombreLikes").notNullable();
        })
        console.log("Table 'publications' créée. ")
    }
    const commentaires = await db.schema.hasTable("commentaires")
    if (!commentaires){
        await db.schema.createTable("commentaires", (table) => {
            table.string("id").primary();
            table.string("idAuteur").notNullable();
            table.foreign("idAuteur").references("utilisateur.id")            
            table.string("idPublication").notNullable();
            table.foreign("idPublication").references("publications.id")
            table.string("message").notNullable();
        })
        console.log("Table 'commentaires' créée. ")
    }
}

/* Exporte l'instance db et la fonction createTable */
module.exports = {
    db,
    createTable
};

