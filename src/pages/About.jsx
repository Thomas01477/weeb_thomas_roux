// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const AboutUs = () => {
  return (
    <div className="max-w-[1000px] mx-auto px-6 text-white min-h-screen flex flex-col py-16">
        
      <div className="overflow-hidden relative w-full border-t border-b border-purple-text p-3 mb-8">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="whitespace-nowrap text-purple-text text-xl font-semibold tracking-wide"
        >
          Connecter • Créer • Innover • Apprendre • Partager • Progresser • Explorer • Imaginer • Réaliser • Connecter • Créer • Innover • Apprendre • Partager • Progresser • Explorer • Imaginer • Réaliser
        </motion.div>
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.2 } },
        }}
        className="text-center"
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl font-extrabold mb-6"
        >
          À propos de <span className="text-purple-text">Nous</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg text-gray-300 max-w-3xl mx-auto"
        >
          Bienvenue sur notre plateforme dédiée au monde du web. Notre mission est
          de rendre accessible les dernières tendances, technologies et
          ressources à tous les passionnés du numérique. Que vous soyez novice
          ou expert, nous sommes là pour vous guider, vous inspirer et vous
          accompagner dans votre évolution digitale.
        </motion.p>
      </motion.div>

    </div>
  );
};

export default AboutUs;
