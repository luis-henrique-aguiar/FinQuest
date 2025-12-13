package br.edu.ifsp.prsi.finquest.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
@Profile("!test")
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        logger.info("Inicializando integração com Firebase...");

        try {
            ClassPathResource serviceAccountResource =
                    new ClassPathResource("finquest-65954-firebase-adminsdk-fbsvc-33095347ec.json");

            if (!serviceAccountResource.exists()) {
                logger.error("CRÍTICO: Arquivo de credenciais do Firebase NÃO ENCONTRADO no classpath!");
                throw new IOException("Arquivo de credenciais ausente.");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccountResource.getInputStream()))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp app = FirebaseApp.initializeApp(options);
                logger.info("Firebase Application inicializado com sucesso: {}", app.getName());
                return app;
            } else {
                logger.info("Firebase Application já estava inicializado (reutilizando instância).");
                return FirebaseApp.getInstance();
            }
        } catch (IOException e) {
            logger.error("FALHA FATAL ao inicializar Firebase: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Bean
    @DependsOn("initializeFirebase")
    public FirebaseAuth firebaseAuth() {
        return FirebaseAuth.getInstance();
    }
}