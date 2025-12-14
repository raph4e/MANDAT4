###################################### MANDAT4 ###########################################


1) À propos
============
Notre *** Clone d'Instagram *** est une application Web full-stack permettant de partager, liker et commenter des publications. Le projet utilise l'API Pexels pour générer dynamiquement des images et vidéos, avec une gestion complète des utilisateurs et interactions sociales.


2) Fonctionnalités
===================

*** Recherche ***
Une barre de recherche permet de rechecher des images et utlisateurs via des mots-clé

*** Authentification ***
- Inscription exige un nom d'utlisateur, mot de passe et numéro de téléphone
- Connexion exige le nom d'utilisateur et le mot de passe
- Déconnexion est un lien dans la navbar qui redirige l'utilisateur vers un bouton "Se déconnecter"

*** Interactions ***
- Likes Like/unlike en cliquant sur l'icône de coeur (bouton) stockés dans une base de données
- Commentaires sont visibles dans les publications
- L'ajout de commentaires est possible en cliquant sur l'icône de bulle de conversation et stockés eux aussi dans la base de données

*** Interface ***
- Stories : défilement horizontal via une barre de défilement
- Publications : flux dynamique généré à partir de Pexels
- Suggestions d'amis : flux dynamique généré à partir de Pexels
- Design responsive : adaptation à plusieurs types d'écran via la règle CSS @media et la balise HTML <meta name="viewport">


3) Technologies
================

*** Frontend ***
- HTML5 : structure sémantique
- CSS3 : appliquer des styles/règles à la structure
- JavaScript Vanilla : logique du côté client pour rendre le site dynamique
- Font Awesome : icônes
- Google fonts : style de la police "Noto Sans"

*** Backend ***
- Node.js : environnement d'exécution JavaScript
- Express.js : framework pour Node.js
- SQLite3 : base de données légère
- Knex.js : constructeur de requêtes SQL

*** API ***
Appels via fetch pour accéder aux images et vidéos du serveur de Pexels 


4) Installation
================

1. Télécharger le projet (MANDAT4).
2. Extraire les fichiers du dossier compressé.
2. Ouvrir un terminal dans le dossier .\connexion-inscription\app via VS Code.
3. Installer les dépendances en tapant la commande : npm install express knex sqlite.
4. Démarrer le serveur en tapant la commande : node .\app.js.
6. Un message dans le terminal devrait afficher : serveur en cours d'exécution sur le port 3000.


5) Démarrage
=============

1. Taper dans le navigateur l’adresse du serveur : http : //localhost :3000.
2. Une page de connexion s’ouvrira. 
3. Si l’utilisateur n’a pas encore de compte, il faudra cliquer sur le lien "S'inscrire" (en-dessous des champs de connexion).
4. Dans le cas d’une inscription, l’utilisateur devra entrer un nom d’utilisateur, un numéro de téléphone et un mot de passe, puis appuyer sur le bouton "Créer un compte".
5. Dans le cas d’une connexion, l’utilisateur devra entrer son nom d'utilsateur et son mot de passe, puis appuyer le bouton "Envoyer".



6) Arborescence du projet
==========================

***ÉTANT TROP VOLUMINEUSE, L'ARBORESCENCE COMPLÈTE DU PROJET SE TROUVE DANS LE FICHIER "arborescence.txt"

Voici une arborescence simplifiée du projet :
C:.
└───connexion-inscription
    ├───app
    │   ├───node_modules
    │   │   ├───.bin
    │   │   ├───@gar
    │   │   │   └───promisify
    │   │   ├───@npmcli
    │   │   │   ├───fs
    │   │   │   │   └───lib
    │   │   │   │       ├───common
    │   │   │   │       │   └───file-url-to-path
    │   │   │   │       ├───cp
    │   │   │   │       ├───mkdir
    │   │   │   │       └───rm
    │   │   │   └───move-file
    │   │   ├───@tootallnate
    │   │   │   └───once
    │   │   │       └───dist
    │   │   ├───abbrev
    │   │   ├───accepts
    │   │   ├───agent-base
    │   │   │   ├───dist
    │   │   │   │   └───src
    │   │   │   └───src
    │   │   ├───agentkeepalive
    │   │   │   └───lib
    │   │   ├───aggregate-error
    │   │   ├───ansi-regex
    │   │   ├───aproba
    │   │   ├───are-we-there-yet
    │   │   │   └───lib
    │   │   ├───balanced-match
    │   │   │   └───.github
    │   │   ├───base64-js
    │   │   ├───bindings
    │   │   ├───bl
    │   │   │   └───test
    │   │   ├───body-parser
    │   │   │   ├───lib
    │   │   │   │   └───types
    │   │   │   └───node_modules
    │   │   │       └───iconv-lite
    │   │   │           ├───encodings
    │   │   │           │   └───tables
    │   │   │           └───lib
    │   │   │               └───helpers
    │   │   ├───brace-expansion
    │   │   ├───buffer
    │   │   ├───bytes
    │   │   ├───cacache
    │   │   │   └───lib
    │   │   │       ├───content
    │   │   │       └───util
    │   │   ├───call-bind-apply-helpers
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───call-bound
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───chownr
    │   │   ├───clean-stack
    │   │   ├───color-support
    │   │   ├───colorette
    │   │   ├───commander
    │   │   │   ├───lib
    │   │   │   └───typings
    │   │   ├───concat-map
    │   │   │   ├───example
    │   │   │   └───test
    │   │   ├───console-control-strings
    │   │   ├───content-disposition
    │   │   ├───content-type
    │   │   ├───cookie
    │   │   ├───cookie-signature
    │   │   ├───debug
    │   │   │   └───src
    │   │   ├───decompress-response
    │   │   ├───deep-extend
    │   │   │   └───lib
    │   │   ├───delegates
    │   │   │   └───test
    │   │   ├───depd
    │   │   │   └───lib
    │   │   │       └───browser
    │   │   ├───detect-libc
    │   │   │   └───lib
    │   │   ├───dunder-proto
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───ee-first
    │   │   ├───emoji-regex
    │   │   │   └───es2015
    │   │   ├───encodeurl
    │   │   ├───encoding
    │   │   │   ├───lib
    │   │   │   └───test
    │   │   ├───end-of-stream
    │   │   ├───env-paths
    │   │   ├───err-code
    │   │   │   └───test
    │   │   ├───es-define-property
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───es-errors
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───es-object-atoms
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───escalade
    │   │   │   ├───dist
    │   │   │   └───sync
    │   │   ├───escape-html
    │   │   ├───esm
    │   │   │   └───esm
    │   │   ├───etag
    │   │   ├───expand-template
    │   │   ├───express
    │   │   │   └───lib
    │   │   ├───file-uri-to-path
    │   │   │   └───test
    │   │   ├───finalhandler
    │   │   ├───forwarded
    │   │   ├───fresh
    │   │   ├───fs-constants
    │   │   ├───fs-minipass
    │   │   ├───fs.realpath
    │   │   ├───function-bind
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───gauge
    │   │   │   └───lib
    │   │   ├───get-intrinsic
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───get-package-type
    │   │   ├───get-proto
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───getopts
    │   │   ├───github-from-package
    │   │   │   ├───example
    │   │   │   └───test
    │   │   ├───glob
    │   │   ├───gopd
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───graceful-fs
    │   │   ├───has-symbols
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   │       └───shams
    │   │   ├───has-unicode
    │   │   ├───hasown
    │   │   │   └───.github
    │   │   ├───http-cache-semantics
    │   │   ├───http-errors
    │   │   │   └───node_modules
    │   │   │       └───statuses
    │   │   ├───http-proxy-agent
    │   │   │   └───dist
    │   │   ├───https-proxy-agent
    │   │   │   └───dist
    │   │   ├───humanize-ms
    │   │   ├───iconv-lite
    │   │   │   ├───.github
    │   │   │   ├───.idea
    │   │   │   │   ├───codeStyles
    │   │   │   │   └───inspectionProfiles
    │   │   │   ├───encodings
    │   │   │   │   └───tables
    │   │   │   └───lib
    │   │   ├───ieee754
    │   │   ├───imurmurhash
    │   │   ├───indent-string
    │   │   ├───infer-owner
    │   │   ├───inflight
    │   │   ├───inherits
    │   │   ├───ini
    │   │   ├───interpret
    │   │   ├───ip-address
    │   │   │   ├───dist
    │   │   │   │   ├───v4
    │   │   │   │   └───v6
    │   │   │   └───src
    │   │   │       ├───v4
    │   │   │       └───v6
    │   │   ├───ipaddr.js
    │   │   │   └───lib
    │   │   ├───is-core-module
    │   │   │   └───test
    │   │   ├───is-fullwidth-code-point
    │   │   ├───is-lambda
    │   │   ├───is-promise
    │   │   ├───isexe
    │   │   │   └───test
    │   │   ├───knex
    │   │   │   ├───bin
    │   │   │   │   └───utils
    │   │   │   ├───lib
    │   │   │   │   ├───dialects
    │   │   │   │   │   ├───better-sqlite3
    │   │   │   │   │   ├───cockroachdb
    │   │   │   │   │   ├───mssql
    │   │   │   │   │   │   ├───query
    │   │   │   │   │   │   └───schema
    │   │   │   │   │   ├───mysql
    │   │   │   │   │   │   ├───query
    │   │   │   │   │   │   └───schema
    │   │   │   │   │   ├───mysql2
    │   │   │   │   │   ├───oracle
    │   │   │   │   │   │   ├───query
    │   │   │   │   │   │   └───schema
    │   │   │   │   │   │       └───internal
    │   │   │   │   │   ├───oracledb
    │   │   │   │   │   │   ├───query
    │   │   │   │   │   │   └───schema
    │   │   │   │   │   ├───pgnative
    │   │   │   │   │   ├───postgres
    │   │   │   │   │   │   ├───execution
    │   │   │   │   │   │   ├───query
    │   │   │   │   │   │   └───schema
    │   │   │   │   │   ├───redshift
    │   │   │   │   │   │   ├───query
    │   │   │   │   │   │   └───schema
    │   │   │   │   │   └───sqlite3
    │   │   │   │   │       ├───execution
    │   │   │   │   │       ├───query
    │   │   │   │   │       └───schema
    │   │   │   │   │           └───internal
    │   │   │   │   ├───execution
    │   │   │   │   │   └───internal
    │   │   │   │   ├───formatter
    │   │   │   │   ├───knex-builder
    │   │   │   │   │   └───internal
    │   │   │   │   ├───migrations
    │   │   │   │   │   ├───common
    │   │   │   │   │   ├───migrate
    │   │   │   │   │   │   ├───sources
    │   │   │   │   │   │   └───stub
    │   │   │   │   │   ├───seed
    │   │   │   │   │   │   ├───sources
    │   │   │   │   │   │   └───stub
    │   │   │   │   │   └───util
    │   │   │   │   ├───query
    │   │   │   │   ├───schema
    │   │   │   │   │   └───internal
    │   │   │   │   └───util
    │   │   │   ├───node_modules
    │   │   │   │   ├───debug
    │   │   │   │   │   └───src
    │   │   │   │   └───ms
    │   │   │   ├───scripts
    │   │   │   │   └───stress-test
    │   │   │   └───types
    │   │   ├───lodash
    │   │   │   └───fp
    │   │   ├───lru-cache
    │   │   ├───make-fetch-happen
    │   │   │   ├───lib
    │   │   │   │   └───cache
    │   │   │   └───node_modules
    │   │   │       └───negotiator
    │   │   │           └───lib
    │   │   ├───math-intrinsics
    │   │   │   ├───.github
    │   │   │   ├───constants
    │   │   │   └───test
    │   │   ├───media-typer
    │   │   ├───merge-descriptors
    │   │   ├───mime-db
    │   │   ├───mime-types
    │   │   ├───mimic-response
    │   │   ├───minimatch
    │   │   ├───minimist
    │   │   │   ├───.github
    │   │   │   ├───example
    │   │   │   └───test
    │   │   ├───minipass
    │   │   ├───minipass-collect
    │   │   ├───minipass-fetch
    │   │   │   └───lib
    │   │   ├───minipass-flush
    │   │   ├───minipass-pipeline
    │   │   ├───minipass-sized
    │   │   │   └───test
    │   │   ├───minizlib
    │   │   ├───mkdirp
    │   │   │   ├───bin
    │   │   │   └───lib
    │   │   ├───mkdirp-classic
    │   │   ├───ms
    │   │   ├───napi-build-utils
    │   │   │   └───.github
    │   │   │       └───workflows
    │   │   ├───negotiator
    │   │   │   └───lib
    │   │   ├───node-abi
    │   │   ├───node-addon-api
    │   │   │   └───tools
    │   │   ├───node-gyp
    │   │   │   ├───.github
    │   │   │   │   └───workflows
    │   │   │   ├───bin
    │   │   │   ├───docs
    │   │   │   ├───gyp
    │   │   │   │   ├───.github
    │   │   │   │   │   └───workflows
    │   │   │   │   ├───data
    │   │   │   │   │   └───win
    │   │   │   │   ├───pylib
    │   │   │   │   │   └───gyp
    │   │   │   │   │       └───generator
    │   │   │   │   └───tools
    │   │   │   │       ├───emacs
    │   │   │   │       │   └───testdata
    │   │   │   │       └───Xcode
    │   │   │   │           └───Specifications
    │   │   │   ├───lib
    │   │   │   ├───src
    │   │   │   └───test
    │   │   │       └───fixtures
    │   │   │           └───nodedir
    │   │   │               └───include
    │   │   │                   └───node
    │   │   ├───nopt
    │   │   │   ├───bin
    │   │   │   └───lib
    │   │   ├───npmlog
    │   │   │   └───lib
    │   │   ├───object-inspect
    │   │   │   ├───.github
    │   │   │   ├───example
    │   │   │   └───test
    │   │   │       └───browser
    │   │   ├───on-finished
    │   │   ├───once
    │   │   ├───p-map
    │   │   ├───parseurl
    │   │   ├───path-is-absolute
    │   │   ├───path-parse
    │   │   ├───path-to-regexp
    │   │   │   └───dist
    │   │   ├───pg-connection-string
    │   │   ├───prebuild-install
    │   │   ├───promise-inflight
    │   │   ├───promise-retry
    │   │   │   └───test
    │   │   ├───proxy-addr
    │   │   ├───pump
    │   │   │   └───.github
    │   │   ├───qs
    │   │   │   ├───.github
    │   │   │   ├───dist
    │   │   │   ├───lib
    │   │   │   └───test
    │   │   ├───range-parser
    │   │   ├───raw-body
    │   │   │   └───node_modules
    │   │   │       └───iconv-lite
    │   │   │           ├───encodings
    │   │   │           │   └───tables
    │   │   │           └───lib
    │   │   │               └───helpers
    │   │   ├───rc
    │   │   │   ├───lib
    │   │   │   └───test
    │   │   ├───readable-stream
    │   │   │   └───lib
    │   │   │       └───internal
    │   │   │           └───streams
    │   │   ├───rechoir
    │   │   │   └───lib
    │   │   ├───resolve
    │   │   │   ├───.github
    │   │   │   ├───bin
    │   │   │   ├───example
    │   │   │   ├───lib
    │   │   │   └───test
    │   │   │       ├───dotdot
    │   │   │       │   └───abc
    │   │   │       ├───module_dir
    │   │   │       │   ├───xmodules
    │   │   │       │   │   └───aaa
    │   │   │       │   ├───ymodules
    │   │   │       │   │   └───aaa
    │   │   │       │   └───zmodules
    │   │   │       │       └───bbb
    │   │   │       ├───node_path
    │   │   │       │   ├───x
    │   │   │       │   │   ├───aaa
    │   │   │       │   │   └───ccc
    │   │   │       │   └───y
    │   │   │       │       ├───bbb
    │   │   │       │       └───ccc
    │   │   │       ├───pathfilter
    │   │   │       │   └───deep_ref
    │   │   │       ├───precedence
    │   │   │       │   ├───aaa
    │   │   │       │   └───bbb
    │   │   │       ├───resolver
    │   │   │       │   ├───baz
    │   │   │       │   ├───browser_field
    │   │   │       │   ├───dot_main
    │   │   │       │   ├───dot_slash_main
    │   │   │       │   ├───false_main
    │   │   │       │   ├───incorrect_main
    │   │   │       │   ├───invalid_main
    │   │   │       │   ├───multirepo
    │   │   │       │   │   └───packages
    │   │   │       │   │       ├───package-a
    │   │   │       │   │       └───package-b
    │   │   │       │   ├───nested_symlinks
    │   │   │       │   │   └───mylib
    │   │   │       │   ├───other_path
    │   │   │       │   │   └───lib
    │   │   │       │   ├───quux
    │   │   │       │   │   └───foo
    │   │   │       │   ├───same_names
    │   │   │       │   │   └───foo
    │   │   │       │   ├───symlinked
    │   │   │       │   │   ├───package
    │   │   │       │   │   └───_
    │   │   │       │   │       ├───node_modules
    │   │   │       │   │       └───symlink_target
    │   │   │       │   └───without_basedir
    │   │   │       └───shadowed_core
    │   │   │           └───node_modules
    │   │   │               └───util
    │   │   ├───resolve-from
    │   │   ├───retry
    │   │   │   ├───example
    │   │   │   ├───lib
    │   │   │   └───test
    │   │   │       └───integration
    │   │   ├───rimraf
    │   │   ├───router
    │   │   │   └───lib
    │   │   ├───safe-buffer
    │   │   ├───safer-buffer
    │   │   ├───semver
    │   │   │   ├───bin
    │   │   │   ├───classes
    │   │   │   ├───functions
    │   │   │   ├───internal
    │   │   │   └───ranges
    │   │   ├───send
    │   │   ├───serve-static
    │   │   ├───set-blocking
    │   │   ├───setprototypeof
    │   │   │   └───test
    │   │   ├───side-channel
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───side-channel-list
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───side-channel-map
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───side-channel-weakmap
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───signal-exit
    │   │   ├───simple-concat
    │   │   │   └───test
    │   │   ├───simple-get
    │   │   │   └───.github
    │   │   │       └───workflows
    │   │   ├───smart-buffer
    │   │   │   ├───build
    │   │   │   ├───docs
    │   │   │   └───typings
    │   │   ├───socks
    │   │   │   ├───build
    │   │   │   │   ├───client
    │   │   │   │   └───common
    │   │   │   ├───docs
    │   │   │   │   └───examples
    │   │   │   │       ├───javascript
    │   │   │   │       └───typescript
    │   │   │   └───typings
    │   │   │       ├───client
    │   │   │       └───common
    │   │   ├───socks-proxy-agent
    │   │   │   └───dist
    │   │   ├───sqlite3
    │   │   │   ├───build
    │   │   │   │   └───Release
    │   │   │   ├───deps
    │   │   │   ├───lib
    │   │   │   └───src
    │   │   ├───ssri
    │   │   ├───statuses
    │   │   ├───string-width
    │   │   ├───string_decoder
    │   │   │   └───lib
    │   │   ├───strip-ansi
    │   │   ├───strip-json-comments
    │   │   ├───supports-preserve-symlinks-flag
    │   │   │   ├───.github
    │   │   │   └───test
    │   │   ├───tar
    │   │   │   ├───lib
    │   │   │   └───node_modules
    │   │   │       └───minipass
    │   │   ├───tar-fs
    │   │   │   ├───node_modules
    │   │   │   │   └───chownr
    │   │   │   └───test
    │   │   │       └───fixtures
    │   │   │           ├───a
    │   │   │           ├───b
    │   │   │           │   └───a
    │   │   │           ├───d
    │   │   │           │   ├───sub-dir
    │   │   │           │   └───sub-files
    │   │   │           └───e
    │   │   │               └───directory
    │   │   ├───tar-stream
    │   │   ├───tarn
    │   │   │   └───dist
    │   │   ├───tildify
    │   │   ├───toidentifier
    │   │   ├───tunnel-agent
    │   │   ├───type-is
    │   │   ├───unique-filename
    │   │   │   ├───.nyc_output
    │   │   │   ├───coverage
    │   │   │   │   └───__root__
    │   │   │   └───test
    │   │   ├───unique-slug
    │   │   │   └───test
    │   │   ├───unpipe
    │   │   ├───util-deprecate
    │   │   ├───vary
    │   │   ├───which
    │   │   │   └───bin
    │   │   ├───wide-align
    │   │   ├───wrappy
    │   │   └───yallist
    │   └───uploads
    └───client


