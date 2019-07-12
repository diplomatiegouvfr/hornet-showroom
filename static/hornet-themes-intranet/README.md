# Hornet-themes

Hornet-themes est le projet qui permet de construire les thèmes du framework Hornet. 

## Pré-requis

- `nodejs` 8.X
- `hornet-js-builder` 1.X installé en global

## Installation

- Récupérer le projet hornet-themes

```shell
$ hb install
```

## Packaging

```shell
$ hb package
```

Le livrable est disponible dans le répertoire :

`target\hornet-themes-5.3.X.zip`

## Intégration dans une application Hornet.js

Définir la propriété themeName dans le fichier `default.json` :

```json
  "themeName": "hornet-themes"
```

## Utilisation en mode CDN

### lancement d'un serveur static express


```shell
$ hb start
```

#### Vérification

Accès aux ressources du CDN via un navigateur web :

`[PROTOCOLE]://[URL]:[PORT]/hornet/css/theme.css`

Par défaut :

`http://localhost:7777/css/theme.css`

### Déploiement sur Apache

#### Pré-requis

Le Frontal Apache doit être configuré avec un `DocumentRoot`, ou un alias permettant d'accéder au répertoire qui contiendra les thèmes.

La configuration du Apache doit permettre les `Cross-Domains` afin de pouvoir charger les polices d'écritures.

Pour celà la configuration doit comporter les lignes suivantes :

```xml
	<IfModule mod_headers.c>
		Header set Access-Control-Allow-Origin *
	</IfModule> 
```

#### Déploiement

1. Récupérer le zip contenant les thèmes.
2. Le décompresser dans le répertoire cible.

L'arborescence obtenue doit ressembler à ceci :

```
[DocumentRoot ou Alias]
	/hornet
		/5.3.X
			/theme_name
```

## Licence

`hornet-themes` est sous [licence cecill 2.1](./LICENSE.md).

Site web : [http://www.cecill.info](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html)