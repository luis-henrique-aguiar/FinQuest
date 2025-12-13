package br.edu.ifsp.prsi.finquest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

import java.net.InetAddress;
import java.net.UnknownHostException;

@SpringBootApplication
public class FinQuestApplication {

    private static final Logger logger = LoggerFactory.getLogger(FinQuestApplication.class);

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(FinQuestApplication.class);
        Environment env = app.run(args).getEnvironment();
        logApplicationStartup(env);
    }

    private static void logApplicationStartup(Environment env) {
        String protocol = "http";
        if (env.getProperty("server.ssl.key-store") != null) {
            protocol = "https";
        }
        String serverPort = env.getProperty("server.port");
        String contextPath = env.getProperty("server.servlet.context-path");
        if (contextPath == null || contextPath.isBlank()) {
            contextPath = "/";
        }
        String hostAddress = "localhost";
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            logger.warn("Não foi possível determinar o endereço de host local: {}", e.getMessage());
        }

        logger.info("""
                
                ----------------------------------------------------------
                \tAplicação '{}' está rodando! Acesso via:
                \tLocal: \t\t{}://localhost:{}{}
                \tExterno: \t{}://{}:{}{}
                \tPerfil(is): \t{}
                ----------------------------------------------------------""",
                env.getProperty("spring.application.name"),
                protocol, serverPort, contextPath,
                protocol, hostAddress, serverPort, contextPath,
                env.getActiveProfiles());
    }
}