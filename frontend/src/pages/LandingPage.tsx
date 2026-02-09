import { motion } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Target,
  Award,
  PlayCircle,
  BookOpen,
  Star,
} from "react-feather";
import { FeatureCard } from '@/features/landing/components/FeatureCard';
import { ContentSection } from '@/features/landing/components/ContentSection';
import mascotImage from "../assets/images/fox.png";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
  const navigate = useNavigate();

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
      repeatType: "loop" as const,
    },
  };

  const features = [
    {
      icon: <Zap size={40} />,
      bgColor: "#007ACC",
      title: "Aprenda Jogando",
      text: "Complete missões diárias, ganhe FinPoints e desbloqueie conquistas enquanto domina suas finanças de forma divertida.",
      delay: 0.1,
    },
    {
      icon: <TrendingUp size={40} />,
      bgColor: "#FFCC00",
      title: "Veja Resultados",
      text: "Dashboards visuais e trilhas de conhecimento organizadas para você acompanhar seu progresso e evolução financeira.",
      delay: 0.3,
    },
  ];

  const stats = [
    { value: "100%", description: "Gratuito para sempre", delay: 0 },
    { value: "15min", description: "Por dia para aprender", delay: 0.1 },
    { value: "50+", description: "Conquistas para desbloquear", delay: 0.2 },
  ];

  return (
    <div className="w-full overflow-x-hidden relative bg-white dark:bg-zinc-950">
      {/* Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[400px] h-[400px] bg-[#007ACC] rounded-full blur-[80px] opacity-30 top-[10%] left-[10%]"
          animate={{
            y: [0, -20, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] bg-[#28A745] rounded-full blur-[80px] opacity-30 top-[60%] left-[70%]"
          animate={{
            y: [0, 25, 0],
            transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] bg-[#FFCC00] rounded-full blur-[80px] opacity-30 top-[80%] left-[20%]"
          animate={{
            y: [0, -10, 0],
            transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 },
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center p-4 md:p-8 relative bg-gradient-to-br from-[#007acc] to-[#28a745] overflow-hidden">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 text-center lg:text-left">
          <div className="text-white">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] drop-shadow-xl"
            >
              Transforme <span className="bg-gradient-to-br from-[#ffcc00] to-[#fd7e14] bg-clip-text text-transparent">Finanças</span> em Diversão
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed font-medium"
            >
              Aprenda a cuidar do seu dinheiro jogando. Complete missões, ganhe
              recompensas e construa seu futuro financeiro!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, translateY: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="px-8 py-4 text-lg md:text-xl font-bold font-sans bg-gradient-to-br from-[#ffcc00] to-[#fd7e14] text-zinc-900 rounded-full inline-flex items-center gap-3 shadow-[0_10px_40px_rgba(255,204,0,0.4)] hover:shadow-[0_15px_50px_rgba(255,204,0,0.6)] transition-all"
              >
                <PlayCircle size={28} />
                Começar Grátis Agora
              </motion.button>
            </motion.div>
          </div>

          <motion.div className="relative flex items-center justify-center lg:order-last order-first">
            {/* Mascot */}
            <motion.div
              animate={{
                y: floatingAnimation.y,
                transition: floatingAnimation.transition,
              }}
              className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border-[3px] border-white/30"
            >
              <img
                src={mascotImage}
                alt="Mascote FinQuest Raposa Exploradora"
                className="w-[80%] h-auto object-contain"
              />
            </motion.div>

            {/* Floating Card */}
            <motion.div
              style={{ top: "10%", left: "-10%" }}
              animate={{
                y: [0, -15, 0],
                transition: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="absolute bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl p-4 md:p-6 shadow-lg flex items-center gap-4 text-white hidden md:flex"
            >
              <Zap size={24} color="#FFCC00" />
              <div>
                <strong className="text-lg">+250 FinPoints</strong>
                <br />
                <small className="opacity-80">Missão completada!</small>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 md:px-8 bg-white dark:bg-zinc-950 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl md:text-5xl font-bold mb-16 text-zinc-900 dark:text-zinc-50"
        >
          Por que <span className="bg-gradient-to-br from-[#007acc] to-[#28a745] bg-clip-text text-transparent">FinQuest</span> funciona?
        </motion.h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              iconBgColor={feature.bgColor}
              title={feature.title}
              text={feature.text}
              delay={feature.delay}
            />
          ))}
        </div>
      </section>

      {/* Content Sections */}
      <ContentSection
        title="Trilhas que fazem sentido"
        titleHighlight="fazem sentido"
        text1="Esqueça aulas chatas e termos complicados. Nossos cursos são divididos em lições curtas e interativas sobre orçamento, investimentos e como evitar dívidas."
        text2="Aprenda no seu ritmo, um passo de cada vez, com conteúdo feito para jovens como você!"
        visualContent="📚"
        visualVariant="learning"
        features={[
          "Lições de 5-10 minutos cada",
          "Conteúdo gamificado e interativo",
          "Certificados ao completar trilhas",
        ]}
        miniCards={[
          {
            icon: <BookOpen size={20} />,
            text: "Lição 1",
            value: "Completa!",
            position: "top-left",
          },
          {
            icon: <Zap size={20} />,
            text: "+50 FP",
            position: "top-right",
          },
          {
            icon: <Award size={20} />,
            text: "3/10 lições",
            position: "bottom-left",
          },
        ]}
      />

      <ContentSection
        title="Metas que inspiram"
        titleHighlight="inspiram"
        text1="Quer comprar aquele videogame novo? Fazer a viagem dos sonhos? Ou simplesmente juntar uma grana para emergências?"
        text2="Crie metas financeiras personalizadas, acompanhe seu progresso em tempo real e desbloqueie emblemas exclusivos a cada conquista!"
        visualContent="🎯"
        visualVariant="goals"
        features={[
          "Crie metas com prazos personalizados",
          "Acompanhe progresso visual",
          "Ganhe emblemas ao atingir marcos",
        ]}
        miniCards={[
          {
            icon: <Target size={20} />,
            text: "Meta: PS5",
            value: "65%",
            position: "top-right",
          },
          {
            icon: <Award size={20} />,
            text: "Emblema desbloqueado!",
            position: "bottom-right",
          },
        ]}
        reverse
        bg="#fff"
      />

      <ContentSection
        title="Experimente sem riscos"
        titleHighlight="sem riscos"
        text1="Nosso simulador de investimentos te deixa testar estratégias e ver o poder dos juros compostos trabalhando a seu favor."
        text2="Experimente diferentes cenários, aprenda com erros virtuais e veja seu dinheiro crescer antes de investir de verdade!"
        visualContent="📈"
        visualVariant="simulator"
        features={[
          "Simule investimentos em CDB, Tesouro e mais",
          "Visualize o efeito dos juros compostos",
          "Compare diferentes estratégias",
        ]}
        miniCards={[
          {
            icon: <TrendingUp size={20} />,
            text: "Retorno",
            value: "+18.5%",
            position: "top-left",
          },
          {
            icon: <Star size={20} />,
            text: "R$ 5.240",
            value: "em 5 anos",
            position: "bottom-left",
          },
        ]}
      />

      {/* Stats Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#007acc] to-[#28a745] text-white relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: stat.delay }}
            >
              <h3 className="text-5xl md:text-6xl font-extrabold mb-2 text-[#ffcc00]">{stat.value}</h3>
              <p className="text-xl opacity-90 font-medium">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 text-center bg-white dark:bg-zinc-900 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 leading-tight">Pronto para a sua missão financeira?</h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Junte-se a milhares de jovens que estão transformando sua relação
            com o dinheiro
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-10 py-5 text-xl font-bold font-sans bg-gradient-to-br from-[#007ACC] to-[#28A745] text-white rounded-full inline-flex items-center gap-3 shadow-[0_10px_40px_rgba(0,122,204,0.4)] hover:shadow-[0_15px_50px_rgba(0,122,204,0.6)] transition-all"
          >
            <Target size={28} />
            Criar Minha Conta Gratuita
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
