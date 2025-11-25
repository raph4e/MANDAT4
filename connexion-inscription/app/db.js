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
    const exist = await db.schema.hasTable("utilisateur");

    /* Si la table n'existe pas, on la créé */
    if (!exist) {
        await db.schema.createTable("utilisateur", (table) => {
            table.string("id").primary();
            table.string("name").notNullable();
            table.string("password").notNullable();
        });
        await db.schema.createTable("utilisateurConnecte", (table) => {
            table.string("id").primary();
            table.string("name").notNullable();
        });
        await db.schema.createTable("publications", (table) => {
            table.string("id").primary();
            table.string("name").notNullable();
            table.string("image").notNullable();
            table.string("biographie").notNullable();
            table.string("idAuteur").notNullable();
            table.foreign("idAuteur").references("utilisateur.id")
            table.string("nombreLikes").notNullable();
        });
        await db.schema.createTable("commentaires", (table) => {
            table.string("id").primary();
            table.string("idAuteur").notNullable();
            table.foreign("idAuteur").references("utilisateur.id")            
            table.string("idPublication").notNullable();
            table.foreign("idPublication").references("publications.id")
            table.string("message").notNullable();
        })
        /* Indique la création de la table */
        console.log("Table 'utilisateur', 'utilisateurConnecte', 'publications' et 'commentaires' créé")
    }
}

/* Exporte l'instance db et la fonction createTable */
module.exports = {
    db,
    createTable
};

