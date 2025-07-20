export interface Article {
	id: string;
	title: string;
	description: string;
	slug: string;
	image: string;
	content: string;
}

const articles = [
	{
		id: '1',
		title: 'React 19 : Les nouvelles fonctionnalités qui changent tout',
		description:
			'Découvrez les nouveautés de React 19 incluant les Server Components, les Actions et bien plus encore.',
		slug: 'react-19-nouvelles-fonctionnalites',
		image:
			'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
		content: `# React 19 : Les nouvelles fonctionnalités qui changent tout

React 19 apporte des changements révolutionnaires dans l'écosystème React. Voici les principales nouveautés :

## Server Components
Les Server Components permettent de rendre des composants côté serveur, réduisant la taille du bundle JavaScript et améliorant les performances.

## Actions
Les Actions simplifient la gestion des formulaires et des mutations de données avec une approche déclarative.

## Hooks améliorés
- \`use()\` hook pour la gestion des promesses
- \`useOptimistic()\` pour les mises à jour optimistes
- \`useFormStatus()\` pour le statut des formulaires

Cette version marque une étape importante dans l'évolution de React vers un framework full-stack.`,
	},
	{
		id: '2',
		title: 'TailwindCSS 4.0 : Une révolution dans le CSS utilitaire',
		description:
			'Explorez les améliorations majeures de TailwindCSS 4.0 avec le nouveau moteur Oxide et les fonctionnalités avancées.',
		slug: 'tailwindcss-4-revolution-css-utilitaire',
		image:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
		content: `# TailwindCSS 4.0 : Une révolution dans le CSS utilitaire

TailwindCSS 4.0 introduit des changements fondamentaux qui transforment l'expérience de développement.

## Le moteur Oxide
Un nouveau moteur écrit en Rust offre des performances exceptionnelles :
- Compilation ultra-rapide
- Détection automatique des classes utilisées
- Optimisation avancée du CSS final

## Nouvelles fonctionnalités
- **CSS-in-JS natif** : Support direct des styles dans le JavaScript
- **Container queries** : Requêtes de conteneur intégrées
- **Modern CSS** : Support des dernières spécifications CSS

## Migration simplifiée
La migration depuis v3 est facilitée par des outils automatisés et une compatibilité préservée.

TailwindCSS 4.0 confirme sa position de leader dans l'écosystème CSS moderne.`,
	},
	{
		id: '3',
		title: 'Remix vs Next.js : Quel framework choisir en 2024 ?',
		description:
			'Comparaison détaillée entre Remix et Next.js pour vous aider à choisir le meilleur framework React pour vos projets.',
		slug: 'remix-vs-nextjs-comparaison-2024',
		image:
			'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
		content: `# Remix vs Next.js : Quel framework choisir en 2024 ?

Le choix entre Remix et Next.js dépend de plusieurs facteurs clés selon votre projet.

## Remix : La simplicité avant tout
Remix se concentre sur les standards web :
- **Approche web-first** : Utilise les APIs natives du navigateur
- **Routing simple** : Basé sur le système de fichiers
- **Performance native** : Optimisations automatiques

### Points forts de Remix
- Courbe d'apprentissage douce
- Excellent SEO par défaut
- Gestion native des formulaires

## Next.js : L'écosystème complet
Next.js offre un écosystème riche :
- **App Router** : Système de routing avancé
- **Server Components** : Rendu côté serveur optimisé
- **Écosystème mature** : Large communauté et plugins

### Points forts de Next.js
- Déploiement Vercel intégré
- Optimisations d'images avancées
- ISR (Incremental Static Regeneration)

## Verdict
- **Remix** : Projets simples à moyens, équipes débutantes
- **Next.js** : Applications complexes, écosystème Vercel`,
	},
	{
		id: '4',
		title: 'ShadcnUI : La bibliothèque de composants qui révolutionne React',
		description:
			"Découvrez comment ShadcnUI simplifie la création d'interfaces utilisateur avec des composants prêts à l'emploi et personnalisables.",
		slug: 'shadcnui-bibliotheque-composants-react',
		image:
			'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
		content: `# ShadcnUI : La bibliothèque de composants qui révolutionne React

ShadcnUI transforme la façon dont nous construisons des interfaces utilisateur en React.

## Philosophy "Copy & Paste"
Contrairement aux bibliothèques traditionnelles, ShadcnUI adopte une approche unique :
- **Composants copiables** : Vous possédez le code source
- **Personnalisation totale** : Modifiez selon vos besoins
- **Pas de dépendance** : Aucune mise à jour forcée

## Intégration parfaite
ShadcnUI s'intègre parfaitement avec :
- **TailwindCSS** : Styling moderne et responsive
- **Radix UI** : Accessibilité et comportements natifs
- **TypeScript** : Type safety complète

## Composants disponibles
Plus de 50 composants prêts à l'emploi :
- Forms et inputs avancés
- Navigation et menus
- Modales et popups
- Charts et visualisations

## Installation rapide
\`\`\`bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
\`\`\`

ShadcnUI représente l'avenir des bibliothèques de composants : flexibilité maximale avec simplicité d'utilisation.`,
	},
	{
		id: '5',
		title: 'HTML sémantique : Les bonnes pratiques pour 2024',
		description:
			"Maîtrisez l'HTML sémantique moderne pour améliorer l'accessibilité et le SEO de vos applications web.",
		slug: 'html-semantique-bonnes-pratiques-2024',
		image:
			'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&h=400&fit=crop',
		content: `# HTML sémantique : Les bonnes pratiques pour 2024

L'HTML sémantique reste la fondation de toute application web moderne et accessible.

## Nouvelles balises HTML5
HTML5 a introduit des balises sémantiques essentielles :
- **\`<article>\`** : Contenu autonome et réutilisable
- **\`<section>\`** : Sections thématiques du document
- **\`<aside>\`** : Contenu complémentaire
- **\`<nav>\`** : Navigation principale

## Structure moderne d'une page
\`\`\`html
<header>
<nav><!-- Navigation principale --></nav>
</header>
<main>
<article>
  <header><!-- En-tête de l'article --></header>
  <section><!-- Contenu principal --></section>
  <aside><!-- Informations complémentaires --></aside>
</article>
</main>
<footer><!-- Pied de page --></footer>
\`\`\`

## Avantages de l'HTML sémantique
- **SEO amélioré** : Meilleure compréhension par les moteurs de recherche
- **Accessibilité** : Navigation facilitée pour les lecteurs d'écran
- **Maintenance** : Code plus lisible et maintenable

## Outils modernes
- **HTML validators** : Vérification automatique
- **Lighthouse** : Audit de qualité
- **axe DevTools** : Test d'accessibilité

L'HTML sémantique n'est pas une option mais une nécessité pour créer des applications web de qualité.`,
	},
];

export const fetchArticles = async (): Promise<Article[]> => {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 200));

	return articles;
};

export const fetchArticle = async ({ slug }: { slug: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
	return articles.find((a) => a.slug === slug);
};
