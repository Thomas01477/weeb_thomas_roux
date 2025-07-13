// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function Home() {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const resRef = useRef(null);
  const resInView = useInView(resRef, { once: true, margin: "-100px" });

  const artRef = useRef(null);
  const artInView = useInView(artRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      className="max-w-[1280px] mx-auto min-h-screen text-white font-sans px-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section className="relative pt-20 pb-16 text-center" variants={fadeUp}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Explorez le <span className="text-purple-text font-light">Web</span> sous toutes{" "}
            <br className="hidden md:inline" /> ses{" "}
            <span className="underline decoration-purple-text">facettes</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Le monde du web évolue constamment, et nous sommes là pour vous guider à travers ses tendances, technologies et meilleures pratiques. Que vous soyez développeur, designer ou passionné du digital, notre blog vous offre du contenu de qualité pour rester à la pointe.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-purple hover:bg-purple-form text-white font-bold py-3 px-8 rounded-lg cursor-pointer">
              Découvrir les articles
            </button>
            <button className="border border-white text-white hover:bg-purple-form font-bold py-3 px-8 rounded-lg cursor-pointer">
              S'abonner à la newsletter
            </button>
          </div>
        </div>
        <div className="mt-16 px-4">
          <img
            src="/assets/home/wireframe-hero.png"
            alt="Interface utilisateur"
            className="mx-auto w-full max-w-4xl rounded-xl shadow-lg"
          />
        </div>
      </motion.section>

      {/* Parteners Section */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Ils nous font confiance</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center">
              <img
                src="/assets/home/smartfinder.png"
                alt="Smart Finder Logo"
                className="w-6 h-6 mr-2"
              />
              <span className="text-xl font-semibold">SmartFinder</span>
            </div>
            <div className="flex items-center text-white">
              <img
                src="/assets/home/zoomerr.png"
                alt="Zoomerr Logo"
                className="w-6 h-6 mr-2"
              />
              <span className="text-xl font-semibold">Zoomer</span>
            </div>
            <div className="flex items-center text-white">
              <img
                src="/assets/home/shells.png"
                alt="Shells Logo"
                className="w-6 h-6 mr-2"
              />
              <span className="text-xl font-semibold">SHELLS</span>
            </div>
            <div className="flex items-center text-white">
              <img
                src="/assets/home/waves.png"
                alt="Waves Logo"
                className="w-6 h-6 mr-2"
              />
              <span className="text-xl font-semibold">WAVES</span>
            </div>
            <div className="flex items-center text-white">
              <img
                src="/assets/home/artvenue.png"
                alt="ArtVenue Logo"
                className="w-6 h-6 mr-2"
              />
              <span className="text-xl font-semibold">ArtVenue</span>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section ref={resRef} className="py-16 bg-background">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <motion.div
            className="md:w-1/2 mb-8 md:mb-0"
            variants={slideLeft}
            initial="hidden"
            animate={resInView ? "visible" : "hidden"}
          >
            <h2 className="text-sm uppercase tracking-wider mb-5">Des ressources pour tous les niveaux</h2>
            <h3 className="text-4xl font-bold mb-6">
              <span className="text-purple-text">Apprenez</span> et
              <span className="text-purple-text"> progressez</span>
            </h3>
            <p className="text-gray-300 mb-6">
            Que vous débutiez en développement web ou que vous soyez un expert cherchant à approfondir vos connaissances, nous vous proposons des tutoriels, guides et bonnes pratiques pour apprendre efficacement.
            </p>
            <a href="#" className="hover:underline hover:text-purple-text flex items-center">
              Explorer les ressources
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            variants={slideRight}
            initial="hidden"
            animate={resInView ? "visible" : "hidden"}
          >
            <img
              src="/assets/home/wireframe-resources.png"
              alt="Maquette Ressources"
              className="w-full max-w-md rounded-xl shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Articles Section */}
      <section ref={artRef} className="py-16 bg-background">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <motion.div
            variants={slideLeft}
            initial="hidden"
            animate={artInView ? "visible" : "hidden"}
          >
            <img
              src="/assets/home/trends.png"
              alt="Carré rouge entouré de carré violet"
              className="w-full max-w-md rounded-xl shadow-lg"
            />
          </motion.div>

          <motion.div
            className="md:w-1/2"
            variants={slideRight}
            initial="hidden"
            animate={artInView ? "visible" : "hidden"}
          >
            <h2 className="text-sm uppercase tracking-wider mb-5">
              Le web, un écosystème en constante évolution
            </h2>
            <h3 className="text-4xl font-bold mb-6">
              Restez informé des dernières <span className="text-purple-text">tendances</span>
            </h3>
            <p className="text-gray-300 mb-6">
              Chaque semaine, nous analysons les nouveautés du web : frameworks émergents, bonnes pratiques SEO, accessibilité, et bien plus encore. Ne manquez aucune actualité du digital !
            </p>
            <a href="#" className="hover:text-purple-text hover:underline flex items-center">
              Lire les articles récents
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default Home;