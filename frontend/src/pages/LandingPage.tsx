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
import * as S from "./LandingPage.styles";
import { FeatureCard } from "../components/landing/FeatureCard";
import { ContentSection } from "../components/landing/ContentSection";
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

  return (
    <S.PageContainer>
      {/* Elementos flutuantes de fundo */}
      <S.BackgroundShapes>
        <S.FloatingShape
          $color="#007ACC"
          $size={400}
          $top="10%"
          $left="10%"
          animate={{
            y: [0, -20, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <S.FloatingShape
          $color="#28A745"
          $size={300}
          $top="60%"
          $left="70%"
          animate={{
            y: [0, 25, 0], // Pode ter variações
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            },
          }}
        />
        <S.FloatingShape
          $color="#FFCC00"
          $size={350}
          $top="80%"
          $left="20%"
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            },
          }}
        />
      </S.BackgroundShapes>

      {/* Hero Section */}
      <S.HeroSection>
        <S.HeroContent>
          <S.HeroText>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Transforme <span>Finanças</span> em Diversão
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Aprenda a cuidar do seu dinheiro jogando. Complete missões, ganhe
              recompensas e construa seu futuro financeiro!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Usando o CTAButton definido nos estilos */}
              <S.CTAButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
              >
                <PlayCircle size={24} />
                Começar Grátis Agora
              </S.CTAButton>
            </motion.div>
          </S.HeroText>

          <S.HeroVisual>
            {/* Aplicando a animação flutuante definida acima */}
            <S.MascotContainer
              animate={{
                y: floatingAnimation.y,
                transition: floatingAnimation.transition,
              }}
            >
              <img
                src={mascotImage}
                alt="Mascote FinQuest Raposa Exploradora"
                style={{ width: "80%", height: "auto", objectFit: "contain" }}
              />
            </S.MascotContainer>
            {/* Cards flutuantes com animação corrigida */}
            <S.FloatingCard
              $delay={0}
              style={{ top: "10%", left: "-10%" }}
              animate={{
                y: [0, -15, 0],
                transition: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <Zap size={24} color="#FFCC00" />
              <div>
                <strong>+250 FinPoints</strong>
                <br />
                <small>Missão completada!</small>
              </div>
            </S.FloatingCard>
          </S.HeroVisual>
        </S.HeroContent>
      </S.HeroSection>

      {/* Features Section */}
      <S.FeaturesSection>
        <S.SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Por que <span>FinQuest</span> funciona?
        </S.SectionTitle>
        <S.FeaturesGrid>
          {/* Mapeando e renderizando o componente FeatureCard */}
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
        </S.FeaturesGrid>
      </S.FeaturesSection>

      {/* Content Sections usando o componente ContentSection */}
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

      {/* Section 2 - Goals */}
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

      {/* Section 3 - Simulator */}
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
      <S.StatsSection>
        <S.StatsGrid>
          <S.StatItem
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Usando motion.h3 para animar o número se desejar */}
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              100%
            </motion.h3>
            <p>Gratuito para sempre</p>
          </S.StatItem>
          {/* ... outros StatItems ... */}
          <S.StatItem
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              15min
            </motion.h3>
            <p>Por dia para aprender</p>
          </S.StatItem>
          <S.StatItem
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              50+
            </motion.h3>
            <p>Conquistas para desbloquear</p>
          </S.StatItem>
        </S.StatsGrid>
      </S.StatsSection>

      {/* Final CTA */}
      <S.FinalCTA>
        <S.CTAContent
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Pronto para a sua missão financeira?</h2>
          <p>
            Junte-se a milhares de jovens que estão transformando sua relação
            com o dinheiro
          </p>
          {/* Usando o CTAButton definido nos estilos */}
          <S.CTAButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // onClick={() => navigate('/register')}
          >
            <Target size={24} />
            Criar Minha Conta Gratuita
          </S.CTAButton>
        </S.CTAContent>
      </S.FinalCTA>
    </S.PageContainer>
  );
};

export default LandingPage;
