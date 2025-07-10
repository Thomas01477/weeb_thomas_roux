function Home() {
   return (
    <div className="bg-background min-h-screen text-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Explorez le Web sous toutes <br className="hidden md:inline"/> ses facettes
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Le monde du web évolue constamment, et nous sommes là pour vous guider à travers ses tendances, technologies et meilleures pratiques. Que vous soyez développeur, designer ou passionné du digital, notre blog vous offre du contenu de qualité pour rester à la pointe.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-purple hover:bg-purple-form text-white font-bold py-3 px-8 rounded-lg transition duration-300">
              Découvrir les articles
            </button>
            <button className="border border-color-purple-text text-purple-text hover:bg-purple-form hover:text-white font-bold py-3 px-8 rounded-lg transition duration-300">
              S'abonner à la newsletter
            </button>
          </div>
        </div>
        <div className="mt-16 px-4">
          <img
            src="https://placehold.co/1000x500/1e293b/a78bfa?text=Placeholder+Image"
            alt="Interface utilisateur"
            className="mx-auto w-full max-w-4xl rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Parteners Section */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">Ils nous font confiance</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center text-gray-400">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
              <span className="text-xl font-semibold">SmartFinder</span>
            </div>
            <div className="flex items-center text-gray-400">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
              <span className="text-xl font-semibold">Zoomer</span>
            </div>
            <div className="flex items-center text-gray-400">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
              <span className="text-xl font-semibold">SHELLS</span>
            </div>
            <div className="flex items-center text-gray-400">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
              <span className="text-xl font-semibold">WAVES</span>
            </div>
            <div className="flex items-center text-gray-400">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
              <span className="text-xl font-semibold">ArtVenue</span>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section*/}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-sm text-purple-text uppercase tracking-wider mb-2">Des ressources pour tous les niveaux</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Apprenez et progressez</h3>
            <p className="text-gray-300 mb-6">
             Que vous débutiez en développement web ou que vous soyez un expert cherchant à approfondir vos connaissances, nous vous proposons des tutoriels, guides et bonnes pratiques pour apprendre efficacement.
            </p>
            <a href="#" className="text-purple-text hover:underline flex items-center">
              Explorer les ressources
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://placehold.co/500x300/1e293b/a78bfa?text=Placeholder+Image"
              alt="Ressources"
              className="w-full max-w-md rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <img
              src="https://placehold.co/500x300/1e293b/a78bfa?text=Placeholder+Image"
              alt="Ressources"
              className="w-full max-w-md rounded-xl shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-sm text-purple-text uppercase tracking-wider mb-2">Le web, un écosystème en constante évolution</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Restez informé des dernières tendances</h3>
            <p className="text-gray-300 mb-6">
              Chaque semaine, nous analysons les nouveautés du web : frameworks émergents, bonnes pratiques SEO, accessibilité, et bien plus encore. Ne manquez aucune actualité du digital ! </p>
            <a href="#" className="text-purple-text hover:underline flex items-center">
              Lire les articles récents
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;