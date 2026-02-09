import greetingAnimation from "../../../assets/animations/fox_greetings.json";
import thinkingAnimation from "../../../assets/animations/thinking_animation.json";
import coinsFallingAnimation from "../../../assets/animations/coins_falling.json";
import goalAchievedAnimation from "../../../assets/animations/goal_achieved.json";

export const presentationSteps = [
    {
        animation: greetingAnimation,
        title: "Bem-vindo ao FinQuest!",
        description:
            "A jornada para dominar suas finanças começa agora. Prepare-se para aprender, economizar e conquistar seus objetivos de um jeito divertido!",
    },
    {
        animation: thinkingAnimation,
        title: "Transforme a Tarefa Chata em Jogo",
        description:
            "Ganhe pontos, suba de nível e compita com amigos. Acompanhar suas finanças nunca foi tão motivador.",
    },
    {
        title: "Missões Diárias, Recompensas Reais.",
        description:
            "Esqueça aulas chatas! Complete missões rápidas, ganhe FinPoints, suba de nível e desbloqueie conquistas enquanto aprende sobre orçamento, investimentos e mais.",
        animation: coinsFallingAnimation,
    },
    {
        title: "Seu Mapa para a Riqueza Pessoal.",
        description:
            "Quer comprar um videogame ou fazer aquela viagem? Crie suas metas, acompanhe seu progresso e deixe o FinQuest te guiar na jornada para alcançá-las. Sua aventura financeira começa agora!",
        animation: goalAchievedAnimation,
    },
];
